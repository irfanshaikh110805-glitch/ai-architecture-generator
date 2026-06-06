"""
Complete authentication and authorization service
"""
import os
import secrets
import logging
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from models import User
from schemas import UserCreate, UserLogin, TokenResponse, UserResponse
from sqlalchemy import select

logger = logging.getLogger(__name__)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Security
security = HTTPBearer()


class AuthService:
    """Authentication service"""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password"""
        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a password against a hash"""
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def generate_api_key() -> str:
        """Generate a secure API key"""
        return f"sk_{secrets.token_urlsafe(32)}"
    
    @staticmethod
    def create_access_token(
        data: Dict[str, Any],
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """Create JWT access token"""
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def decode_token(token: str) -> Dict[str, Any]:
        """Decode and verify JWT token"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except JWTError as e:
            logger.warning(f"Token decode error: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    @staticmethod
    async def register_user(
        user_data: UserCreate,
        session: AsyncSession
    ) -> User:
        """Register a new user"""
        # Check if user exists
        result = await session.execute(
            select(User).where(User.email == user_data.email)
        )
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create user
        hashed_password = AuthService.hash_password(user_data.password)
        api_key = AuthService.generate_api_key()
        
        user = User(
            email=user_data.email,
            password_hash=hashed_password,
            api_key=api_key,
            full_name=user_data.full_name,
            tier="free"  # Default tier
        )
        
        session.add(user)
        await session.commit()
        await session.refresh(user)
        
        logger.info(f"User registered: {user.email}")
        return user
    
    @staticmethod
    async def authenticate_user(
        credentials: UserLogin,
        session: AsyncSession
    ) -> User:
        """Authenticate user with email and password"""
        result = await session.execute(
            select(User).where(User.email == credentials.email)
        )
        user = result.scalar_one_or_none()
        
        if not user or not AuthService.verify_password(
            credentials.password,
            user.password_hash
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is inactive"
            )
        
        # Update last login
        user.last_login = datetime.now(timezone.utc)
        await session.commit()
        
        logger.info(f"User authenticated: {user.email}")
        return user
    
    @staticmethod
    async def get_user_by_api_key(
        api_key: str,
        session: AsyncSession
    ) -> Optional[User]:
        """Get user by API key"""
        result = await session.execute(
            select(User).where(User.api_key == api_key)
        )
        return result.scalar_one_or_none()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: AsyncSession = Depends(get_db)
) -> User:
    """Get current authenticated user from JWT token"""
    token = credentials.credentials
    
    # Decode token
    payload = AuthService.decode_token(token)
    user_id: int = payload.get("sub")
    
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    # Get user from database
    result = await session.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    
    return user


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    session: AsyncSession = Depends(get_db)
) -> Optional[User]:
    """Get current user if authenticated, None otherwise"""
    if not credentials:
        return None
    
    try:
        return await get_current_user(credentials, session)
    except HTTPException:
        return None


async def get_user_by_api_key_header(
    api_key: str,
    session: AsyncSession = Depends(get_db)
) -> User:
    """Get user by API key from header"""
    user = await AuthService.get_user_by_api_key(api_key, session)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    
    return user


def require_tier(required_tier: str):
    """Dependency to require specific user tier"""
    tier_hierarchy = {"free": 0, "pro": 1, "enterprise": 2}
    
    async def tier_checker(user: User = Depends(get_current_user)) -> User:
        user_tier_level = tier_hierarchy.get(user.tier, 0)
        required_tier_level = tier_hierarchy.get(required_tier, 0)
        
        if user_tier_level < required_tier_level:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"This feature requires {required_tier} tier or higher"
            )
        
        return user
    
    return tier_checker
