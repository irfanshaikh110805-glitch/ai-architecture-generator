from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from security import sanitize_input, validate_input_length

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
        """Validate and sanitize the project idea input"""
        # Sanitize input to prevent XSS and SQL injection
        sanitized = sanitize_input(v, allow_html=False)
        
        # Validate length
        is_valid, error_msg = validate_input_length(sanitized)
        if not is_valid:
            raise ValueError(error_msg)
        
        # Check for empty after sanitization
        if not sanitized or sanitized.isspace():
            raise ValueError("Project idea cannot be empty or contain only whitespace")
        
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
