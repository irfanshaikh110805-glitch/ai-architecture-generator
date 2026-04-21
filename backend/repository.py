"""
Repository pattern for data access
"""
import json
from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, and_
from sqlalchemy.orm import selectinload
from models import (
    User, Architecture, Feature, DatabaseTable, API,
    RoadmapPhase, ArchitectureComponent
)
from exceptions import NotFoundError, DuplicateResourceError, DatabaseError
import logging

logger = logging.getLogger(__name__)


class UserRepository:
    """User repository"""
    
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def create(self, email: str, password_hash: str, api_key: str) -> User:
        """Create new user"""
        try:
            # Check if email exists
            existing = await self.get_by_email(email)
            if existing:
                raise DuplicateResourceError("User", "email", email)
            
            user = User(
                email=email,
                password_hash=password_hash,
                api_key=api_key
            )
            self.session.add(user)
            await self.session.commit()
            await self.session.refresh(user)
            return user
        except DuplicateResourceError:
            raise
        except Exception as e:
            await self.session.rollback()
            raise DatabaseError(f"Failed to create user: {e}")
    
    async def get_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID"""
        result = await self.session.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        result = await self.session.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()
    
    async def get_by_api_key(self, api_key: str) -> Optional[User]:
        """Get user by API key"""
        result = await self.session.execute(
            select(User).where(User.api_key == api_key)
        )
        return result.scalar_one_or_none()


class ArchitectureRepository:
    """Architecture repository"""
    
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def create(
        self,
        user_id: int,
        idea: str,
        architecture_data: Dict[str, Any]
    ) -> Architecture:
        """Create new architecture with all related data"""
        try:
            # Generate idea hash
            idea_hash = Architecture.generate_idea_hash(idea)
            
            # Create main architecture
            architecture = Architecture(
                user_id=user_id,
                idea=idea,
                idea_hash=idea_hash,
                architecture_type=architecture_data.get("architecture", {}).get("type"),
                tech_stack_frontend=architecture_data.get("architecture", {}).get("tech_stack", {}).get("frontend"),
                tech_stack_backend=architecture_data.get("architecture", {}).get("tech_stack", {}).get("backend"),
                tech_stack_database=architecture_data.get("architecture", {}).get("tech_stack", {}).get("database"),
                er_diagram=architecture_data.get("erDiagram"),
                architecture_diagram=architecture_data.get("architectureDiagram"),
                estimation_hours=architecture_data.get("estimation", {}).get("hours"),
                estimation_team_size=architecture_data.get("estimation", {}).get("team_size"),
                estimation_cost=architecture_data.get("estimation", {}).get("cost"),
                is_fallback=architecture_data.get("_fallback", False),
                fallback_message=architecture_data.get("_message")
            )
            self.session.add(architecture)
            await self.session.flush()  # Get ID
            
            # Create features
            for idx, feature_data in enumerate(architecture_data.get("features", [])):
                feature = Feature(
                    architecture_id=architecture.id,
                    name=feature_data.get("name", ""),
                    priority=feature_data.get("priority", "Could"),
                    order=idx
                )
                self.session.add(feature)
            
            # Create database tables
            for idx, table_data in enumerate(architecture_data.get("database", [])):
                db_table = DatabaseTable(
                    architecture_id=architecture.id,
                    table_name=table_data.get("table", ""),
                    fields=json.dumps(table_data.get("fields", [])),
                    relationships=json.dumps(table_data.get("relationships", [])),
                    order=idx
                )
                self.session.add(db_table)
            
            # Create APIs
            for idx, api_data in enumerate(architecture_data.get("apis", [])):
                api = API(
                    architecture_id=architecture.id,
                    method=api_data.get("method", "GET"),
                    endpoint=api_data.get("endpoint", ""),
                    description=api_data.get("description", ""),
                    order=idx
                )
                self.session.add(api)
            
            # Create roadmap phases
            for idx, phase_data in enumerate(architecture_data.get("roadmap", [])):
                phase = RoadmapPhase(
                    architecture_id=architecture.id,
                    phase_name=phase_data.get("phase", ""),
                    tasks=json.dumps(phase_data.get("tasks", [])),
                    order=idx
                )
                self.session.add(phase)
            
            # Create components
            for idx, component_name in enumerate(architecture_data.get("architecture", {}).get("components", [])):
                component = ArchitectureComponent(
                    architecture_id=architecture.id,
                    component_name=component_name,
                    order=idx
                )
                self.session.add(component)
            
            await self.session.commit()
            await self.session.refresh(architecture)
            return architecture
        except Exception as e:
            await self.session.rollback()
            logger.error(f"Failed to create architecture: {e}")
            raise DatabaseError(f"Failed to create architecture: {e}")
    
    async def get_by_id(self, architecture_id: int, user_id: Optional[int] = None) -> Optional[Architecture]:
        """Get architecture by ID with all relationships"""
        query = select(Architecture).options(
            selectinload(Architecture.features),
            selectinload(Architecture.database_tables),
            selectinload(Architecture.apis),
            selectinload(Architecture.roadmap_phases),
            selectinload(Architecture.components)
        ).where(Architecture.id == architecture_id)
        
        if user_id:
            query = query.where(Architecture.user_id == user_id)
        
        result = await self.session.execute(query)
        return result.scalar_one_or_none()
    
    async def get_by_idea_hash(self, idea_hash: str, user_id: int) -> Optional[Architecture]:
        """Get architecture by idea hash (for deduplication)"""
        result = await self.session.execute(
            select(Architecture)
            .where(and_(
                Architecture.idea_hash == idea_hash,
                Architecture.user_id == user_id
            ))
            .order_by(desc(Architecture.created_at))
        )
        return result.scalar_one_or_none()
    
    async def list_by_user(
        self,
        user_id: int,
        page: int = 1,
        per_page: int = 20,
        order_by: str = "-created_at"
    ) -> tuple[List[Architecture], int]:
        """List architectures for user with pagination"""
        # Parse order_by
        if order_by.startswith("-"):
            order_column = desc(getattr(Architecture, order_by[1:]))
        else:
            order_column = getattr(Architecture, order_by)
        
        # Count total
        count_result = await self.session.execute(
            select(func.count()).select_from(Architecture).where(Architecture.user_id == user_id)
        )
        total = count_result.scalar()
        
        # Get page
        offset = (page - 1) * per_page
        result = await self.session.execute(
            select(Architecture)
            .where(Architecture.user_id == user_id)
            .order_by(order_column)
            .limit(per_page)
            .offset(offset)
        )
        architectures = result.scalars().all()
        
        return list(architectures), total
    
    async def delete(self, architecture_id: int, user_id: int) -> bool:
        """Delete architecture"""
        architecture = await self.get_by_id(architecture_id, user_id)
        if not architecture:
            raise NotFoundError("Architecture", architecture_id)
        
        await self.session.delete(architecture)
        await self.session.commit()
        return True
