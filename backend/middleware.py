"""
Request validation and timeout middleware
"""
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
import time
import asyncio
import logging

logger = logging.getLogger(__name__)

# Configuration
MAX_REQUEST_SIZE = 10 * 1024 * 1024  # 10 MB
REQUEST_TIMEOUT = 60  # 60 seconds


class RequestValidationMiddleware(BaseHTTPMiddleware):
    """Middleware for request size limits and timeout enforcement"""
    
    async def dispatch(self, request: Request, call_next):
        # Check request size
        content_length = request.headers.get('content-length')
        client_host = request.client.host if request.client else "unknown"
        if content_length and int(content_length) > MAX_REQUEST_SIZE:
            logger.warning(f"Request too large: {content_length} bytes from {client_host}")
            return JSONResponse(
                status_code=413,
                content={
                    "error": "Request too large",
                    "message": f"Request body must be less than {MAX_REQUEST_SIZE / 1024 / 1024}MB"
                }
            )
        
        # Add timeout enforcement
        start_time = time.time()
        
        try:
            # Create timeout task
            response = await asyncio.wait_for(
                call_next(request),
                timeout=REQUEST_TIMEOUT
            )
            
            # Log slow requests
            duration = time.time() - start_time
            if duration > 10:  # Log requests taking more than 10 seconds
                client_host = request.client.host if request.client else "unknown"
                logger.warning(
                    f"Slow request: {request.method} {request.url.path} "
                    f"took {duration:.2f}s from {client_host}"
                )
            
            return response
            
        except asyncio.TimeoutError:
            client_host = request.client.host if request.client else "unknown"
            logger.error(
                f"Request timeout: {request.method} {request.url.path} "
                f"from {client_host}"
            )
            return JSONResponse(
                status_code=504,
                content={
                    "error": "Request timeout",
                    "message": f"Request took longer than {REQUEST_TIMEOUT} seconds"
                }
            )
        except Exception as e:
            logger.error(f"Request processing error: {e}")
            raise


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for structured request logging"""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Log request
        client_host = request.client.host if request.client else "unknown"
        logger.info(
            f'{{"event":"request_start","method":"{request.method}",'
            f'"path":"{request.url.path}","client":"{client_host}"}}'
        )
        
        try:
            response = await call_next(request)
            
            # Log response
            duration = time.time() - start_time
            logger.info(
                f'{{"event":"request_complete","method":"{request.method}",'
                f'"path":"{request.url.path}","status":{response.status_code},'
                f'"duration":{duration:.3f},"client":"{client_host}"}}'
            )
            
            return response
            
        except Exception as e:
            duration = time.time() - start_time
            logger.error(
                f'{{"event":"request_error","method":"{request.method}",'
                f'"path":"{request.url.path}","error":"{str(e)}",'
                f'"duration":{duration:.3f},"client":"{client_host}"}}'
            )
            raise
