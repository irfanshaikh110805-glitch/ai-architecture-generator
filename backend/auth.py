"""
Authentication and authorization
"""
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from config import settings
from repository import UserRepository
from exceptions import AuthenticationError, AuthorizationError
import logging

logger = logging.getLogger(__name__)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security scheme
security = HTTPBearer()


def hash_password(password: str) -> str:
    """Hash password"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password"""
    return pwd_context.verify(plain_password, hashed_password)


def generate_api_key() -> str:
    """Generate API key"""
    return secrets.token_urlsafe(32)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> dict:
    """Decode JWT access token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError as e:
        logger.warning(f"JWT decode error: {e}")
        raise AuthenticationError("Invalid token")


async def get_current_user_from_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: AsyncSession = Depends(lambda: None)  # Will be overridden
) -> dict:
    """Get current user from JWT token"""
    try:
        token = credentials.credentials
        payload = decode_access_token(token)
        user_id: int = payload.get("sub")
        
        if user_id is None:
            raise AuthenticationError("Invalid token payload")
        
        # Verify user exists and is active
        user_repo = UserRepository(session)
        user = await user_repo.get_by_id(user_id)
        
        if user is None or not user.is_active:
            raise AuthenticationError("User not found or inactive")
        
        return {
            "id": user.id,
            "email": user.email,
            "api_key": user.api_key
        }
    except AuthenticationError:
        raise
    except Exception as e:
        logger.error(f"Authentication error: {e}")
        raise AuthenticationError("Authentication failed")


async def get_current_user_from_api_key(
    api_key: str,
    session: AsyncSession
) -> dict:
    """Get current user from API key"""
    user_repo = UserRepository(session)
    user = await user_repo.get_by_api_key(api_key)
    
    if user is None or not user.is_active:
        raise AuthenticationError("Invalid API key")
    
    return {
        "id": user.id,
        "email": user.email,
        "api_key": user.api_key
    }


def require_auth(user: dict = Depends(get_current_user_from_token)) -> dict:
    """Dependency to require authentication"""
    return user
