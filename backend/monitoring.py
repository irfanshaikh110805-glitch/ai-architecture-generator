"""
Monitoring and metrics collection
"""
import time
import logging
from typing import Dict, Any
from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST
from sqlalchemy import text
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)

# Prometheus metrics
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

REQUEST_DURATION = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration in seconds',
    ['method', 'endpoint']
)

REQUEST_IN_PROGRESS = Gauge(
    'http_requests_in_progress',
    'HTTP requests currently in progress'
)

ARCHITECTURE_GENERATION_COUNT = Counter(
    'architecture_generation_total',
    'Total architecture generations',
    ['status']
)

ARCHITECTURE_GENERATION_DURATION = Histogram(
    'architecture_generation_duration_seconds',
    'Architecture generation duration in seconds'
)

class MetricsMiddleware(BaseHTTPMiddleware):
    """Middleware to collect request metrics"""
    
    async def dispatch(self, request: Request, call_next):
        REQUEST_IN_PROGRESS.inc()
        start_time = time.time()
        
        try:
            response = await call_next(request)
            duration = time.time() - start_time
            
            # Record metrics
            REQUEST_COUNT.labels(
                method=request.method,
                endpoint=request.url.path,
                status=response.status_code
            ).inc()
            
            REQUEST_DURATION.labels(
                method=request.method,
                endpoint=request.url.path
            ).observe(duration)
            
            # Add custom headers
            response.headers["X-Process-Time"] = f"{duration:.3f}s"
            
            return response
        finally:
            REQUEST_IN_PROGRESS.dec()

def get_metrics() -> Response:
    """Expose Prometheus metrics"""
    return Response(
        content=generate_latest(),
        media_type=CONTENT_TYPE_LATEST
    )

async def check_database_health() -> Dict[str, Any]:
    """Check database connectivity"""
    try:
        from database import engine
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "healthy", "message": "Database connection successful"}
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return {"status": "unhealthy", "message": str(e)}

async def check_ai_service_health() -> Dict[str, Any]:
    """Check AI service availability"""
    try:
        import os
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "your_gemini_api_key_here":
            return {"status": "unhealthy", "message": "Gemini API key not configured"}
        return {"status": "healthy", "message": "Gemini API configured"}
    except Exception as e:
        logger.error(f"AI service health check failed: {e}")
        return {"status": "unhealthy", "message": str(e)}

async def get_detailed_health() -> Dict[str, Any]:
    """Get detailed health status of all components"""
    db_health = await check_database_health()
    ai_health = await check_ai_service_health()
    
    overall_status = "healthy"
    if db_health["status"] == "unhealthy" or ai_health["status"] == "unhealthy":
        overall_status = "degraded"
    
    return {
        "status": overall_status,
        "timestamp": time.time(),
        "components": {
            "database": db_health,
            "ai_service": ai_health
        }
    }
