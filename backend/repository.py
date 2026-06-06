"""
Repository layer for database operations
"""
import logging
from typing import List, Optional, Tuple
from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, desc
from sqlalchemy.orm import joinedload
from models import (
    User, Architecture, Feature, DatabaseTable, API,
    Component, RoadmapPhase, UsageRecord
)

logger = logging.getLogger(__name__)


class UserRepository:
    """User data access layer"""
    
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def create(
        self,
        email: str,
        password_hash: str,
        api_key: str,
        full_name: Optional[str] = None
    ) -> User:
        """Create a new user"""
        user = User(
            email=email,
            password_hash=password_hash,
            api_key=api_key,
            full_name=full_name
        )
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user
    
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
    
    async def update(self, user: User) -> User:
        """Update user"""
        await self.session.commit()
        await self.session.refresh(user)
        return user


class ArchitectureRepository:
    """Architecture data access layer"""
    
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def create(
        self,
        user_id: int,
        idea: str,
        architecture_data: dict,
        generation_time: float = 0.0
    ) -> Architecture:
        """Create a new architecture with all related data"""
        # Create main architecture
        architecture = Architecture(
            user_id=user_id,
            idea=idea,
            idea_hash=Architecture.generate_idea_hash(idea),
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
            fallback_message=architecture_data.get("_message"),
            generation_time=generation_time
        )
        
        self.session.add(architecture)
        await self.session.flush()  # Get architecture.id
        
        # Add features
        for idx, feature_data in enumerate(architecture_data.get("features", [])):
            feature = Feature(
                architecture_id=architecture.id,
                name=feature_data.get("name", ""),
                priority=feature_data.get("priority", "Could"),
                order=idx
            )
            self.session.add(feature)
        
        # Add database tables
        import json
        for idx, table_data in enumerate(architecture_data.get("database", [])):
            table = DatabaseTable(
                architecture_id=architecture.id,
                table_name=table_data.get("table", ""),
                fields=json.dumps(table_data.get("fields", [])),
                relationships=json.dumps(table_data.get("relationships", [])),
                order=idx
            )
            self.session.add(table)
        
        # Add APIs
        for idx, api_data in enumerate(architecture_data.get("apis", [])):
            api = API(
                architecture_id=architecture.id,
                method=api_data.get("method", "GET"),
                endpoint=api_data.get("endpoint", ""),
                description=api_data.get("description", ""),
                order=idx
            )
            self.session.add(api)
        
        # Add components
        for idx, component_name in enumerate(architecture_data.get("architecture", {}).get("components", [])):
            component = Component(
                architecture_id=architecture.id,
                component_name=component_name,
                order=idx
            )
            self.session.add(component)
        
        # Add roadmap phases
        for idx, phase_data in enumerate(architecture_data.get("roadmap", [])):
            phase = RoadmapPhase(
                architecture_id=architecture.id,
                phase_name=phase_data.get("phase", ""),
                tasks=json.dumps(phase_data.get("tasks", [])),
                order=idx
            )
            self.session.add(phase)
        
        await self.session.commit()
        await self.session.refresh(architecture)
        return architecture
    
    async def get_by_id(
        self,
        architecture_id: int,
        user_id: int
    ) -> Optional[Architecture]:
        """Get architecture by ID with all relationships"""
        result = await self.session.execute(
            select(Architecture)
            .options(
                joinedload(Architecture.features),
                joinedload(Architecture.database_tables),
                joinedload(Architecture.apis),
                joinedload(Architecture.components),
                joinedload(Architecture.roadmap_phases)
            )
            .where(
                and_(
                    Architecture.id == architecture_id,
                    Architecture.user_id == user_id
                )
            )
        )
        return result.unique().scalar_one_or_none()
    
    async def get_by_idea_hash(
        self,
        idea_hash: str,
        user_id: int
    ) -> Optional[Architecture]:
        """Get architecture by idea hash (for deduplication)"""
        result = await self.session.execute(
            select(Architecture)
            .options(
                joinedload(Architecture.features),
                joinedload(Architecture.database_tables),
                joinedload(Architecture.apis),
                joinedload(Architecture.components),
                joinedload(Architecture.roadmap_phases)
            )
            .where(
                and_(
                    Architecture.idea_hash == idea_hash,
                    Architecture.user_id == user_id
                )
            )
            .order_by(desc(Architecture.created_at))
            .limit(1)
        )
        return result.unique().scalar_one_or_none()
    
    async def list_by_user(
        self,
        user_id: int,
        page: int = 1,
        per_page: int = 20,
        order_by: str = "-created_at"
    ) -> Tuple[List[Architecture], int]:
        """List architectures for user with pagination"""
        # Parse order_by
        if order_by.startswith("-"):
            order_column = desc(getattr(Architecture, order_by[1:]))
        else:
            order_column = getattr(Architecture, order_by)
        
        # Get total count
        count_result = await self.session.execute(
            select(func.count(Architecture.id)).where(Architecture.user_id == user_id)
        )
        total = count_result.scalar()
        
        # Get paginated results with eager loading to prevent N+1 queries
        offset = (page - 1) * per_page
        result = await self.session.execute(
            select(Architecture)
            .options(
                joinedload(Architecture.features),
                joinedload(Architecture.database_tables),
                joinedload(Architecture.apis),
                joinedload(Architecture.components),
                joinedload(Architecture.roadmap_phases)
            )
            .where(Architecture.user_id == user_id)
            .order_by(order_column)
            .offset(offset)
            .limit(per_page)
        )
        architectures = result.unique().scalars().all()
        
        return list(architectures), total
    
    async def delete(self, architecture_id: int, user_id: int) -> bool:
        """Delete architecture"""
        result = await self.session.execute(
            select(Architecture).where(
                and_(
                    Architecture.id == architecture_id,
                    Architecture.user_id == user_id
                )
            )
        )
        architecture = result.scalar_one_or_none()
        
        if architecture:
            await self.session.delete(architecture)
            await self.session.commit()
            return True
        return False


class UsageRepository:
    """Usage tracking data access layer"""
    
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def record_usage(
        self,
        user_id: int,
        endpoint: str,
        tokens_used: int = 0,
        cost: float = 0.0
    ) -> UsageRecord:
        """Record API usage"""
        record = UsageRecord(
            user_id=user_id,
            endpoint=endpoint,
            tokens_used=tokens_used,
            cost=cost
        )
        self.session.add(record)
        await self.session.commit()
        return record
    
    async def get_daily_count(self, user_id: int) -> int:
        """Get today's usage count"""
        today = datetime.now(timezone.utc).date()
        result = await self.session.execute(
            select(func.count(UsageRecord.id))
            .where(
                and_(
                    UsageRecord.user_id == user_id,
                    func.date(UsageRecord.created_at) == today
                )
            )
        )
        return result.scalar() or 0
    
    async def get_monthly_count(self, user_id: int) -> int:
        """Get this month's usage count"""
        now = datetime.now(timezone.utc)
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        result = await self.session.execute(
            select(func.count(UsageRecord.id))
            .where(
                and_(
                    UsageRecord.user_id == user_id,
                    UsageRecord.created_at >= month_start
                )
            )
        )
        return result.scalar() or 0
    
    async def get_cost_stats(self, user_id: int, days: int = 30) -> dict:
        """Get cost statistics for user"""
        since = datetime.now(timezone.utc) - timedelta(days=days)
        
        result = await self.session.execute(
            select(
                func.count(UsageRecord.id).label("total_requests"),
                func.sum(UsageRecord.tokens_used).label("total_tokens"),
                func.sum(UsageRecord.cost).label("total_cost")
            )
            .where(
                and_(
                    UsageRecord.user_id == user_id,
                    UsageRecord.created_at >= since
                )
            )
        )
        row = result.one()
        
        total_requests = row.total_requests or 0
        total_tokens = row.total_tokens or 0
        total_cost = row.total_cost or 0.0
        
        return {
            "total_requests": total_requests,
            "total_tokens": total_tokens,
            "total_cost": total_cost,
            "average_cost_per_request": total_cost / total_requests if total_requests > 0 else 0.0
        }
