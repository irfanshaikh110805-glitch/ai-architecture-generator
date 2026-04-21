"""
Service layer for business logic
"""
import logging
from typing import Optional, Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from repository import ArchitectureRepository, UserRepository
from cache import CacheService
from ai_service import generate_architecture
from models import Architecture
from schemas import ArchitectureResponse
from exceptions import NotFoundError
import hashlib

logger = logging.getLogger(__name__)


class ArchitectureService:
    """Architecture generation and management service"""
    
    def __init__(
        self,
        session: AsyncSession,
        cache: CacheService,
        ai_service: AIService
    ):
        self.session = session
        self.cache = cache
        self.ai_service = ai_service
        self.repository = ArchitectureRepository(session)
    
    def _get_cache_key(self, idea: str, user_id: int) -> str:
        """Generate cache key for idea"""
        idea_hash = Architecture.generate_idea_hash(idea)
        return f"arch:{user_id}:{idea_hash}"
    
    async def generate(
        self,
        user_id: int,
        idea: str,
        force_regenerate: bool = False
    ) -> ArchitectureResponse:
        """
        Generate architecture with caching and deduplication
        
        Args:
            user_id: User ID
            idea: Project idea
            force_regenerate: Skip cache and regenerate
        
        Returns:
            ArchitectureResponse
        """
        cache_key = self._get_cache_key(idea, user_id)
        
        # Check cache first (unless force regenerate)
        if not force_regenerate:
            cached = await self.cache.get(cache_key)
            if cached:
                logger.info(f"Cache hit for user {user_id}")
                return ArchitectureResponse(**cached)
            
            # Check database for existing architecture
            idea_hash = Architecture.generate_idea_hash(idea)
            existing = await self.repository.get_by_idea_hash(idea_hash, user_id)
            if existing:
                logger.info(f"Found existing architecture for user {user_id}")
                response = self._architecture_to_response(existing)
                # Cache it
                await self.cache.set(cache_key, response.model_dump())
                return response
        
        # Generate new architecture
        logger.info(f"Generating new architecture for user {user_id}")
        result = await self.ai_service.generate_architecture(idea)
        
        # Save to database
        architecture_data = result.model_dump()
        architecture = await self.repository.create(user_id, idea, architecture_data)
        
        # Cache the result
        await self.cache.set(cache_key, architecture_data)
        
        return result
    
    async def get_by_id(
        self,
        architecture_id: int,
        user_id: int
    ) -> ArchitectureResponse:
        """Get architecture by ID"""
        architecture = await self.repository.get_by_id(architecture_id, user_id)
        if not architecture:
            raise NotFoundError("Architecture", architecture_id)
        
        return self._architecture_to_response(architecture)
    
    async def list_architectures(
        self,
        user_id: int,
        page: int = 1,
        per_page: int = 20,
        order_by: str = "-created_at"
    ) -> tuple[List[Dict[str, Any]], int, int]:
        """
        List architectures for user
        
        Returns:
            (architectures, total, pages)
        """
        architectures, total = await self.repository.list_by_user(
            user_id, page, per_page, order_by
        )
        
        pages = (total + per_page - 1) // per_page
        
        # Convert to dict
        items = [
            {
                "id": arch.id,
                "idea": arch.idea[:100] + "..." if len(arch.idea) > 100 else arch.idea,
                "architecture_type": arch.architecture_type,
                "created_at": arch.created_at.isoformat(),
                "is_fallback": arch.is_fallback
            }
            for arch in architectures
        ]
        
        return items, total, pages
    
    async def delete(self, architecture_id: int, user_id: int) -> bool:
        """Delete architecture"""
        # Clear cache
        architecture = await self.repository.get_by_id(architecture_id, user_id)
        if architecture:
            cache_key = self._get_cache_key(architecture.idea, user_id)
            await self.cache.delete(cache_key)
        
        return await self.repository.delete(architecture_id, user_id)
    
    def _architecture_to_response(self, architecture: Architecture) -> ArchitectureResponse:
        """Convert Architecture model to ArchitectureResponse"""
        import json
        
        return ArchitectureResponse(
            features=[
                {"name": f.name, "priority": f.priority}
                for f in sorted(architecture.features, key=lambda x: x.order)
            ],
            database=[
                {
                    "table": t.table_name,
                    "fields": json.loads(t.fields),
                    "relationships": json.loads(t.relationships) if t.relationships else []
                }
                for t in sorted(architecture.database_tables, key=lambda x: x.order)
            ],
            apis=[
                {
                    "method": a.method,
                    "endpoint": a.endpoint,
                    "description": a.description or ""
                }
                for a in sorted(architecture.apis, key=lambda x: x.order)
            ],
            architecture={
                "type": architecture.architecture_type or "Monolith",
                "components": [
                    c.component_name
                    for c in sorted(architecture.components, key=lambda x: x.order)
                ],
                "tech_stack": {
                    "frontend": architecture.tech_stack_frontend or "",
                    "backend": architecture.tech_stack_backend or "",
                    "database": architecture.tech_stack_database or ""
                }
            },
            erDiagram=architecture.er_diagram or "",
            architectureDiagram=architecture.architecture_diagram or "",
            roadmap=[
                {
                    "phase": p.phase_name,
                    "tasks": json.loads(p.tasks)
                }
                for p in sorted(architecture.roadmap_phases, key=lambda x: x.order)
            ],
            estimation={
                "hours": architecture.estimation_hours or "",
                "team_size": architecture.estimation_team_size or "",
                "cost": architecture.estimation_cost or ""
            },
            _fallback=architecture.is_fallback,
            _message=architecture.fallback_message
        )


class UserService:
    """User management service"""
    
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repository = UserRepository(session)
    
    async def create_user(
        self,
        email: str,
        password: str
    ) -> Dict[str, Any]:
        """Create new user"""
        from auth import hash_password, generate_api_key
        
        password_hash = hash_password(password)
        api_key = generate_api_key()
        
        user = await self.repository.create(email, password_hash, api_key)
        
        return {
            "id": user.id,
            "email": user.email,
            "api_key": user.api_key,
            "created_at": user.created_at.isoformat()
        }
    
    async def get_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        """Get user by ID"""
        user = await self.repository.get_by_id(user_id)
        if not user:
            return None
        
        return {
            "id": user.id,
            "email": user.email,
            "is_active": user.is_active,
            "created_at": user.created_at.isoformat()
        }
    
    async def authenticate(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate user"""
        from auth import verify_password
        
        user = await self.repository.get_by_email(email)
        if not user or not user.is_active:
            return None
        
        if not verify_password(password, user.password_hash):
            return None
        
        return {
            "id": user.id,
            "email": user.email,
            "api_key": user.api_key
        }
