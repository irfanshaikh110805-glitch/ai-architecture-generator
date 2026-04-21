from fastapi import FastAPI, HTTPException, Request, Response, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
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

# Initialize database and run migrations
try:
    logger.info("Running database migrations...")
    run_migrations()
    logger.info("Database initialization complete")
except Exception as e:
    logger.error(f"Database initialization failed: {e}")
    if os.getenv("ENVIRONMENT") == "production":
        raise

app = FastAPI(
    title="AI Architecture Generator API",
    description="Generate production-ready system architectures using Gemini AI",
    version="2.0.0",
    docs_url="/docs" if os.getenv("ENVIRONMENT", "development") == "development" else None,
    redoc_url="/redoc" if os.getenv("ENVIRONMENT", "development") == "development" else None,
)

# Create API v1 router
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
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Process-Time", "X-Deprecated", "X-Deprecation-Message"],
    max_age=3600,
)

# Trusted Host Middleware (prevents host header attacks) - disabled in development
if os.getenv("ENVIRONMENT") == "production":
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["localhost", "127.0.0.1", "*.yourdomain.com"]
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
    response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
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

@api_v1_router.get("/health")
@limiter.limit(f"{SecurityConfig.RATE_LIMIT_REQUESTS}/{SecurityConfig.RATE_LIMIT_WINDOW}seconds")
async def health_check_v1(request: Request, response: Response):
    return {"status": "healthy", "model": "gemini-2.0-flash", "version": "v1"}

# Include v1 router
app.include_router(api_v1_router)
