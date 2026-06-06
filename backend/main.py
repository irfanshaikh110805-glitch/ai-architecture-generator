from fastapi import FastAPI, HTTPException, Request, Response, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from sqlalchemy.ext.asyncio import AsyncSession
from schemas import ProjectIdeaRequest, ArchitectureResponse
from ai_service import generate_architecture
from security import SecurityConfig
from rate_limiter import limiter, custom_rate_limit_handler
from monitoring import (
    MetricsMiddleware,
    get_metrics,
    get_detailed_health,
    ARCHITECTURE_GENERATION_COUNT,
    ARCHITECTURE_GENERATION_DURATION
)
from exceptions import ArchitectureGeneratorError
from sentry_config import init_sentry
from env_validator import EnvironmentValidator
from database import init_db, run_migrations
from middleware import RequestValidationMiddleware, RequestLoggingMiddleware
from models import User
from dotenv import load_dotenv
import logging
import time
import os

# Load .env BEFORE any config/validation modules read environment variables
load_dotenv()

# Validate environment variables on startup
EnvironmentValidator.validate_or_exit()

# Configure structured logging FIRST so all subsequent log messages are captured
_handlers = [logging.StreamHandler()]
if os.getenv("ENVIRONMENT") == "production":
    _handlers.append(logging.FileHandler("app.log"))
logging.basicConfig(
    level=logging.INFO,
    format='{"timestamp":"%(asctime)s","level":"%(levelname)s","logger":"%(name)s","message":"%(message)s"}',
    handlers=_handlers
)
logger = logging.getLogger(__name__)

# Initialize Sentry (after logging so the confirmation message is visible)
init_sentry()

# Validate security configuration
SecurityConfig.validate_secret_key()

# Note: Database migrations will be run on startup event (see @app.on_event("startup") below)

app = FastAPI(
    title="AI Architecture Generator API",
    description="Generate production-ready system architectures using Gemini AI",
    version="2.0.0",
    docs_url="/docs" if os.getenv("ENVIRONMENT", "development") == "development" else None,
    redoc_url="/redoc" if os.getenv("ENVIRONMENT", "development") == "development" else None,
)

# Startup event - run migrations in proper context
@app.on_event("startup")
async def startup_event():
    """Run database migrations and initialization on startup"""
    # Skip Alembic migrations for Supabase projects
    # Run migrations manually in Supabase SQL Editor instead
    logger.info("Skipping Alembic migrations (use Supabase SQL Editor)")
    logger.info("To set up database: Run backend/supabase_migration.sql in Supabase SQL Editor")
    logger.info("See SUPABASE_QUICK_START.md for instructions")

# Create API v1 router
from fastapi import APIRouter
api_v1_router = APIRouter(prefix="/api/v1")

# Add rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, custom_rate_limit_handler)

# Add monitoring middleware
app.add_middleware(MetricsMiddleware)

# Add request validation and logging middleware
app.add_middleware(RequestValidationMiddleware)
app.add_middleware(RequestLoggingMiddleware)

# CORS Configuration - Must be added LAST (processes first)
logger.info(f"Configuring CORS with origins: {SecurityConfig.ALLOWED_ORIGINS}")
app.add_middleware(
    CORSMiddleware,
    allow_origins=SecurityConfig.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
    expose_headers=["X-Process-Time", "X-Deprecated", "X-Deprecation-Message"],
    max_age=3600,
)

# Trusted Host Middleware (prevents host header attacks) - disabled in development
if os.getenv("ENVIRONMENT") == "production":
    allowed_hosts = [host.strip() for host in os.getenv("ALLOWED_HOSTS", "*").split(",")]
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=allowed_hosts
    )

# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    
    # Security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    # Improved CSP - allow necessary sources for modern web apps
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data: https: blob:; "
        "font-src 'self' data:; "
        "connect-src 'self' https:; "
        "frame-ancestors 'none'; "
        "base-uri 'self'; "
        "form-action 'self'"
    )
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    
    return response

# NOTE: X-Process-Time header is already set by MetricsMiddleware above.
# A second middleware is intentionally omitted to avoid duplicate headers.

@app.get("/")
@limiter.limit(f"{SecurityConfig.RATE_LIMIT_REQUESTS}/{SecurityConfig.RATE_LIMIT_WINDOW}seconds")
async def root(request: Request, response: Response):
    return {"message": "AI Architecture Generator API", "status": "running", "version": "2.0.0"}

@app.get("/health")
@limiter.limit(f"{SecurityConfig.RATE_LIMIT_REQUESTS}/{SecurityConfig.RATE_LIMIT_WINDOW}seconds")
async def health_check(request: Request, response: Response):
    return {"status": "healthy", "model": "gemini-2.0-flash"}

@app.get("/health/detailed")
async def detailed_health_check(request: Request):
    """Detailed health check with component status"""
    return await get_detailed_health()

@app.get("/metrics")
async def metrics(request: Request):
    """Prometheus metrics endpoint"""
    return get_metrics()

# Legacy endpoint (deprecated, use /api/v1/generate)
# Legacy endpoint (deprecated, use /api/v1/generate)
@app.post("/generate", response_model=ArchitectureResponse, deprecated=True)
@limiter.limit(f"{SecurityConfig.RATE_LIMIT_REQUESTS}/{SecurityConfig.RATE_LIMIT_WINDOW}seconds")
async def generate_system_architecture_legacy(request: Request, response: Response, project_request: ProjectIdeaRequest):
    """Legacy endpoint - use /api/v1/generate instead"""
    result = await generate_system_architecture_v1(request, response, project_request)
    return result

# API v1 endpoints
@api_v1_router.post("/generate", response_model=ArchitectureResponse)
@limiter.limit(f"{SecurityConfig.RATE_LIMIT_REQUESTS}/{SecurityConfig.RATE_LIMIT_WINDOW}seconds")
async def generate_system_architecture_v1(request: Request, response: Response, project_request: ProjectIdeaRequest):
    start_time = time.time()
    try:
        logger.info(f"Generating architecture for: {project_request.idea[:80]}...")
        result = await generate_architecture(project_request.idea)
        
        # Record metrics
        duration = time.time() - start_time
        ARCHITECTURE_GENERATION_DURATION.observe(duration)
        ARCHITECTURE_GENERATION_COUNT.labels(status="success").inc()
        
        logger.info(f"Architecture generated successfully in {duration:.2f}s")
        return result
    except ValueError as e:
        ARCHITECTURE_GENERATION_COUNT.labels(status="validation_error").inc()
        logger.warning(f"Validation error: {e}")
        raise HTTPException(status_code=422, detail=str(e))
    except ArchitectureGeneratorError as e:
        status_label = "quota_error" if getattr(e, "status_code", 500) == 429 else "service_error"
        ARCHITECTURE_GENERATION_COUNT.labels(status=status_label).inc()
        logger.error(f"Application error ({status_label}): {e.message}")
        raise HTTPException(status_code=getattr(e, "status_code", 500), detail=e.message)
    except Exception as e:
        ARCHITECTURE_GENERATION_COUNT.labels(status="error").inc()
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate architecture. Please try again.")

# Authentication endpoints
from auth_service import AuthService, get_current_user
from schemas import UserCreate, UserLogin, TokenResponse, UserResponse
from database import get_db

@api_v1_router.post("/auth/register", response_model=TokenResponse)
@limiter.limit("10/hour")  # Stricter rate limit for auth
async def register(
    request: Request,
    user_data: UserCreate,
    session: AsyncSession = Depends(get_db)
):
    """Register a new user"""
    try:
        user = await AuthService.register_user(user_data, session)
        
        # Create access token
        access_token = AuthService.create_access_token(
            data={"sub": user.id, "email": user.email}
        )
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse(
                id=user.id,
                email=user.email,
                full_name=user.full_name,
                tier=user.tier,
                is_active=user.is_active
            )
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail="Registration failed")

@api_v1_router.post("/auth/login", response_model=TokenResponse)
@limiter.limit("20/hour")  # Stricter rate limit for auth
async def login(
    request: Request,
    credentials: UserLogin,
    session: AsyncSession = Depends(get_db)
):
    """Login with email and password"""
    try:
        user = await AuthService.authenticate_user(credentials, session)
        
        # Create access token
        access_token = AuthService.create_access_token(
            data={"sub": user.id, "email": user.email}
        )
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse(
                id=user.id,
                email=user.email,
                full_name=user.full_name,
                tier=user.tier,
                is_active=user.is_active
            )
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Login failed")

@api_v1_router.get("/auth/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(get_current_user)
):
    """Get current user information"""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        tier=current_user.tier,
        is_active=current_user.is_active
    )

@api_v1_router.post("/auth/api-key")
async def regenerate_api_key(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Regenerate API key for current user"""
    try:
        current_user.api_key = AuthService.generate_api_key()
        await session.commit()
        await session.refresh(current_user)
        
        return {"api_key": current_user.api_key}
    except Exception as e:
        logger.error(f"API key regeneration error: {e}")
        raise HTTPException(status_code=500, detail="Failed to regenerate API key")

@api_v1_router.get("/health")
@limiter.limit(f"{SecurityConfig.RATE_LIMIT_REQUESTS}/{SecurityConfig.RATE_LIMIT_WINDOW}seconds")
async def health_check_v1(request: Request, response: Response):
    return {"status": "healthy", "model": "gemini-2.0-flash", "version": "v1"}


# Include v1 router
app.include_router(api_v1_router)
