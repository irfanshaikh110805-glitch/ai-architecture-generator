"""
Rate limiting middleware using slowapi
"""
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request
from security import SecurityConfig
import os
import logging

logger = logging.getLogger(__name__)

# Get Redis URL for distributed rate limiting
REDIS_URL = os.getenv("REDIS_URL", "memory://")


def get_real_client_ip(request: Request) -> str:
    """
    Custom key function for rate limiting behind reverse proxies (Render, Cloudflare, Nginx).
    Reads the original client IP from X-Forwarded-For if available.
    """
    x_forwarded_for = request.headers.get("X-Forwarded-For")
    if x_forwarded_for:
        # X-Forwarded-For header contains client IP first, followed by proxies
        client_ip = x_forwarded_for.split(",")[0].strip()
        if client_ip:
            return client_ip
    
    # Fallback to standard remote address
    return get_remote_address(request)


# Initialize rate limiter
limiter = Limiter(
    key_func=get_real_client_ip,
    storage_uri=REDIS_URL,
    headers_enabled=True,
)


def get_rate_limit_key(request: Request) -> str:
    """
    Custom key function for rate limiting
    """
    return get_real_client_ip(request)


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

