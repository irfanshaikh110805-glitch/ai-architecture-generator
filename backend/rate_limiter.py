"""
Rate limiting middleware using slowapi
"""
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request
from security import SecurityConfig
import os

# Get Redis URL for distributed rate limiting
REDIS_URL = os.getenv("REDIS_URL", "memory://")

# Initialize rate limiter with Redis for production
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[f"{SecurityConfig.RATE_LIMIT_REQUESTS}/{SecurityConfig.RATE_LIMIT_WINDOW}seconds"],
    storage_uri=REDIS_URL,  # Use Redis instead of memory
    headers_enabled=True,
)


def get_rate_limit_key(request: Request) -> str:
    """
    Custom key function for rate limiting
    Uses IP address as the key
    """
    return get_remote_address(request)


# Custom rate limit exceeded handler
async def custom_rate_limit_handler(request: Request, exc: RateLimitExceeded):
    """
    Custom handler for rate limit exceeded
    Returns 429 with helpful message
    """
    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=429,
        content={
            "error": "Rate limit exceeded",
            "message": f"Too many requests. Limit: {SecurityConfig.RATE_LIMIT_REQUESTS} requests per {SecurityConfig.RATE_LIMIT_WINDOW // 60} minutes",
            "retry_after": exc.detail,
        },
    )
