"""
Enhanced structured logging configuration with structlog
"""
import logging
import sys
import os
from datetime import datetime
import structlog
from structlog.processors import JSONRenderer, TimeStamper, add_log_level, format_exc_info
from structlog.stdlib import add_logger_name, filter_by_level


def setup_logging():
    """Configure structured logging for the application"""
    
    # Determine log level from environment
    log_level = os.getenv("LOG_LEVEL", "INFO").upper()
    
    # Configure standard library logging
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=getattr(logging, log_level),
    )
    
    # Configure structlog
    structlog.configure(
        processors=[
            filter_by_level,
            add_log_level,
            add_logger_name,
            TimeStamper(fmt="iso", utc=True),
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.StackInfoRenderer(),
            format_exc_info,
            structlog.processors.UnicodeDecoder(),
            JSONRenderer() if os.getenv("ENVIRONMENT") == "production" else structlog.dev.ConsoleRenderer(),
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        cache_logger_on_first_use=True,
    )


def get_logger(name: str = None):
    """Get a structured logger instance"""
    return structlog.get_logger(name)


# Context managers for request logging
class RequestContext:
    """Context manager for request-scoped logging"""
    
    def __init__(self, request_id: str, user_id: int = None, endpoint: str = None):
        self.request_id = request_id
        self.user_id = user_id
        self.endpoint = endpoint
        self.logger = get_logger()
    
    def __enter__(self):
        structlog.contextvars.clear_contextvars()
        structlog.contextvars.bind_contextvars(
            request_id=self.request_id,
            user_id=self.user_id,
            endpoint=self.endpoint,
        )
        return self.logger
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        structlog.contextvars.clear_contextvars()
        return False


# Helper functions for common logging patterns
def log_api_request(logger, method: str, path: str, user_id: int = None, **kwargs):
    """Log API request with standard fields"""
    logger.info(
        "api_request",
        method=method,
        path=path,
        user_id=user_id,
        **kwargs
    )


def log_api_response(logger, method: str, path: str, status_code: int, duration_ms: float, **kwargs):
    """Log API response with standard fields"""
    logger.info(
        "api_response",
        method=method,
        path=path,
        status_code=status_code,
        duration_ms=duration_ms,
        **kwargs
    )


def log_architecture_generation(
    logger,
    user_id: int,
    idea_length: int,
    generation_time: float,
    cache_hit: bool,
    tier: str,
    **kwargs
):
    """Log architecture generation with metrics"""
    logger.info(
        "architecture_generated",
        user_id=user_id,
        idea_length=idea_length,
        generation_time=generation_time,
        cache_hit=cache_hit,
        tier=tier,
        **kwargs
    )


def log_error(logger, error: Exception, context: dict = None):
    """Log error with context"""
    logger.error(
        "error_occurred",
        error_type=type(error).__name__,
        error_message=str(error),
        context=context or {},
        exc_info=True
    )


def log_cache_operation(logger, operation: str, key: str, hit: bool = None, **kwargs):
    """Log cache operations"""
    logger.debug(
        "cache_operation",
        operation=operation,
        key=key,
        hit=hit,
        **kwargs
    )


def log_database_query(logger, query_type: str, table: str, duration_ms: float, **kwargs):
    """Log database queries"""
    logger.debug(
        "database_query",
        query_type=query_type,
        table=table,
        duration_ms=duration_ms,
        **kwargs
    )


def log_rate_limit(logger, user_id: int, endpoint: str, limit: int, remaining: int, **kwargs):
    """Log rate limit checks"""
    logger.info(
        "rate_limit_check",
        user_id=user_id,
        endpoint=endpoint,
        limit=limit,
        remaining=remaining,
        **kwargs
    )


def log_authentication(logger, event: str, user_id: int = None, email: str = None, success: bool = True, **kwargs):
    """Log authentication events"""
    logger.info(
        "authentication_event",
        event=event,
        user_id=user_id,
        email=email,
        success=success,
        **kwargs
    )
