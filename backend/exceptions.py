"""
Custom exception hierarchy for better error handling
"""
from typing import Optional, Dict, Any


class ArchitectureGeneratorError(Exception):
    """Base exception for all application errors"""
    
    def __init__(
        self,
        message: str,
        code: str = "INTERNAL_ERROR",
        status_code: int = 500,
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)


class ValidationError(ArchitectureGeneratorError):
    """Input validation failed"""
    
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            code="VALIDATION_ERROR",
            status_code=422,
            details=details
        )


class AuthenticationError(ArchitectureGeneratorError):
    """Authentication failed"""
    
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(
            message=message,
            code="AUTHENTICATION_ERROR",
            status_code=401
        )


class AuthorizationError(ArchitectureGeneratorError):
    """Authorization failed"""
    
    def __init__(self, message: str = "Access denied"):
        super().__init__(
            message=message,
            code="AUTHORIZATION_ERROR",
            status_code=403
        )


class NotFoundError(ArchitectureGeneratorError):
    """Resource not found"""
    
    def __init__(self, resource: str, resource_id: Any):
        super().__init__(
            message=f"{resource} with id {resource_id} not found",
            code="NOT_FOUND",
            status_code=404,
            details={"resource": resource, "id": str(resource_id)}
        )


class AIServiceError(ArchitectureGeneratorError):
    """AI service error"""
    
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            code="AI_SERVICE_ERROR",
            status_code=500,
            details=details
        )


class QuotaExceededError(AIServiceError):
    """API quota exceeded"""
    
    def __init__(self, message: str = "API quota exceeded. Please try again later."):
        super().__init__(
            message=message,
            details={"retry_after": 3600}
        )
        self.code = "QUOTA_EXCEEDED"
        self.status_code = 429


class RateLimitError(ArchitectureGeneratorError):
    """Rate limit exceeded"""
    
    def __init__(self, retry_after: int = 60):
        super().__init__(
            message=f"Rate limit exceeded. Retry after {retry_after} seconds.",
            code="RATE_LIMIT_EXCEEDED",
            status_code=429,
            details={"retry_after": retry_after}
        )


class DatabaseError(ArchitectureGeneratorError):
    """Database operation failed"""
    
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            code="DATABASE_ERROR",
            status_code=500,
            details=details
        )


class CacheError(ArchitectureGeneratorError):
    """Cache operation failed"""
    
    def __init__(self, message: str):
        super().__init__(
            message=message,
            code="CACHE_ERROR",
            status_code=500
        )


class DuplicateResourceError(ArchitectureGeneratorError):
    """Resource already exists"""
    
    def __init__(self, resource: str, field: str, value: Any):
        super().__init__(
            message=f"{resource} with {field}={value} already exists",
            code="DUPLICATE_RESOURCE",
            status_code=409,
            details={"resource": resource, "field": field, "value": str(value)}
        )
