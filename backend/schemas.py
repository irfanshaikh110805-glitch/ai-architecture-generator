from pydantic import BaseModel, Field, field_validator, EmailStr
from typing import List, Optional
from datetime import datetime
from security import sanitize_input, validate_input_length


# ============================================================================
# Authentication Schemas
# ============================================================================

class UserCreate(BaseModel):
    """User registration schema"""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    full_name: Optional[str] = Field(None, max_length=255)
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Validate password strength with enhanced requirements"""
        from security import SecurityConfig
        is_valid, error_message = SecurityConfig.validate_password_strength(v)
        if not is_valid:
            raise ValueError(error_message)
        return v
    
    @field_validator('full_name')
    @classmethod
    def validate_full_name(cls, v: Optional[str]) -> Optional[str]:
        """Validate and sanitize full name"""
        if v:
            v = v.strip()
            # Prevent XSS in name fields
            import re
            if re.search(r'[<>"\'/]', v):
                raise ValueError("Name contains invalid characters")
            if len(v) > 100:
                raise ValueError("Name is too long (max 100 characters)")
        return v


class UserLogin(BaseModel):
    """User login schema"""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """JWT token response"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 604800  # 7 days in seconds


class UserResponse(BaseModel):
    """User response schema"""
    id: int
    email: str
    full_name: Optional[str]
    tier: str
    daily_limit: int
    monthly_limit: int
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserWithToken(BaseModel):
    """User with authentication token"""
    user: UserResponse
    token: TokenResponse


class APIKeyResponse(BaseModel):
    """API key response"""
    api_key: str
    created_at: datetime


# ============================================================================
# Architecture Generation Schemas
# ============================================================================

class ProjectIdeaRequest(BaseModel):
    idea: str = Field(
        ..., 
        min_length=10, 
        max_length=5000,
        description="Project idea description"
    )
    
    @field_validator('idea')
    @classmethod
    def validate_and_sanitize_idea(cls, v: str) -> str:
        """Validate and sanitize the project idea input with XSS protection"""
        # Sanitize input to prevent XSS and SQL injection
        sanitized = sanitize_input(v, allow_html=False)
        
        # Validate length
        is_valid, error_msg = validate_input_length(sanitized)
        if not is_valid:
            raise ValueError(error_msg)
        
        # Check for empty after sanitization
        if not sanitized or sanitized.isspace():
            raise ValueError("Project idea cannot be empty or contain only whitespace")
        
        # Additional validation for malicious patterns
        import re
        dangerous_patterns = [
            r'<script[^>]*>.*?</script>',
            r'javascript:',
            r'on\w+\s*=',  # event handlers
            r'<iframe[^>]*>',
            r'eval\s*\(',
        ]
        
        for pattern in dangerous_patterns:
            if re.search(pattern, sanitized, re.IGNORECASE):
                raise ValueError("Project idea contains potentially malicious content")
        
        return sanitized


class Feature(BaseModel):
    name: str = ""
    priority: str = "Could"


class DatabaseTable(BaseModel):
    table: str = ""
    fields: List[str] = []
    relationships: List[str] = []


class API(BaseModel):
    method: str = "GET"
    endpoint: str = ""
    description: str = ""


class TechStack(BaseModel):
    frontend: str = ""
    backend: str = ""
    database: str = ""


class Architecture(BaseModel):
    type: str = "Monolith"
    components: List[str] = []
    tech_stack: TechStack = TechStack()


class RoadmapPhase(BaseModel):
    phase: str = ""
    tasks: List[str] = []


class Estimation(BaseModel):
    hours: str = ""
    team_size: str = ""
    cost: str = ""


class ArchitectureResponse(BaseModel):
    features: List[Feature] = []
    database: List[DatabaseTable] = []
    apis: List[API] = []
    architecture: Architecture = Architecture()
    erDiagram: str = ""
    architectureDiagram: str = ""
    roadmap: List[RoadmapPhase] = []
    estimation: Estimation = Estimation()
    _fallback: Optional[bool] = False
    _message: Optional[str] = None


class ArchitectureSummary(BaseModel):
    """Summary of generated architecture"""
    id: int
    idea: str
    architecture_type: str
    created_at: datetime
    is_fallback: bool
    
    class Config:
        from_attributes = True


class ArchitectureListResponse(BaseModel):
    """Paginated list of architectures"""
    items: List[ArchitectureSummary]
    total: int
    page: int
    per_page: int
    pages: int


# ============================================================================
# Usage & Statistics Schemas
# ============================================================================

class UsageStats(BaseModel):
    """User usage statistics"""
    daily_count: int
    monthly_count: int
    daily_limit: int
    monthly_limit: int
    daily_remaining: int
    monthly_remaining: int


class CostStats(BaseModel):
    """Cost statistics"""
    total_requests: int
    total_tokens: int
    total_cost: float
    average_cost_per_request: float

