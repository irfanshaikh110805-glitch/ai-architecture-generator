from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Index, Float
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func
from datetime import datetime, timezone
import hashlib

Base = declarative_base()


class User(Base):
    """User model with authentication and tier management"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    api_key = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    
    # Tier and limits
    tier = Column(String(50), default="free", nullable=False)  # free, pro, enterprise
    daily_limit = Column(Integer, default=5, nullable=False)
    monthly_limit = Column(Integer, default=100, nullable=False)
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))
    
    # Relationships
    architectures = relationship("Architecture", back_populates="user", cascade="all, delete-orphan")
    usage_records = relationship("UsageRecord", back_populates="user", cascade="all, delete-orphan")
    
    # Indexes for performance
    __table_args__ = (
        Index('idx_user_email', 'email'),
        Index('idx_user_api_key', 'api_key'),
    )
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, tier={self.tier})>"


class Architecture(Base):
    """Generated architecture with full details"""
    __tablename__ = "architectures"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Input
    idea = Column(Text, nullable=False)
    idea_hash = Column(String(64), index=True, nullable=False)
    
    # Architecture details
    architecture_type = Column(String(100))  # Monolith, Microservices, etc.
    tech_stack_frontend = Column(String(255))
    tech_stack_backend = Column(String(255))
    tech_stack_database = Column(String(255))
    
    # Diagrams
    er_diagram = Column(Text)
    architecture_diagram = Column(Text)
    
    # Estimation
    estimation_hours = Column(String(100))
    estimation_team_size = Column(String(100))
    estimation_cost = Column(String(255))
    
    # Metadata
    is_fallback = Column(Boolean, default=False)
    fallback_message = Column(Text)
    generation_time = Column(Float)  # seconds
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="architectures")
    features = relationship("Feature", back_populates="architecture", cascade="all, delete-orphan")
    database_tables = relationship("DatabaseTable", back_populates="architecture", cascade="all, delete-orphan")
    apis = relationship("API", back_populates="architecture", cascade="all, delete-orphan")
    components = relationship("Component", back_populates="architecture", cascade="all, delete-orphan")
    roadmap_phases = relationship("RoadmapPhase", back_populates="architecture", cascade="all, delete-orphan")
    
    # Indexes
    __table_args__ = (
        Index('idx_user_created', 'user_id', 'created_at'),
        Index('idx_idea_hash', 'idea_hash'),
        Index('idx_architecture_user_id', 'user_id'),
    )
    
    @staticmethod
    def generate_idea_hash(idea: str) -> str:
        """Generate SHA-256 hash of idea for deduplication"""
        return hashlib.sha256(idea.strip().lower().encode()).hexdigest()
    
    def __repr__(self):
        return f"<Architecture(id={self.id}, user_id={self.user_id}, type={self.architecture_type})>"


class Feature(Base):
    """Feature with MoSCoW prioritization"""
    __tablename__ = "features"
    
    id = Column(Integer, primary_key=True, index=True)
    architecture_id = Column(Integer, ForeignKey("architectures.id", ondelete="CASCADE"), nullable=False)
    
    name = Column(String(255), nullable=False)
    priority = Column(String(50), nullable=False)  # Must, Should, Could, Won't
    description = Column(Text)
    order = Column(Integer, default=0)
    
    architecture = relationship("Architecture", back_populates="features")
    
    def __repr__(self):
        return f"<Feature(name={self.name}, priority={self.priority})>"


class DatabaseTable(Base):
    """Database table schema"""
    __tablename__ = "database_tables"
    
    id = Column(Integer, primary_key=True, index=True)
    architecture_id = Column(Integer, ForeignKey("architectures.id", ondelete="CASCADE"), nullable=False)
    
    table_name = Column(String(255), nullable=False)
    fields = Column(Text, nullable=False)  # JSON array
    relationships = Column(Text)  # JSON array
    order = Column(Integer, default=0)
    
    architecture = relationship("Architecture", back_populates="database_tables")
    
    def __repr__(self):
        return f"<DatabaseTable(name={self.table_name})>"


class API(Base):
    """API endpoint specification"""
    __tablename__ = "apis"
    
    id = Column(Integer, primary_key=True, index=True)
    architecture_id = Column(Integer, ForeignKey("architectures.id", ondelete="CASCADE"), nullable=False)
    
    method = Column(String(10), nullable=False)  # GET, POST, PUT, DELETE, PATCH
    endpoint = Column(String(255), nullable=False)
    description = Column(Text)
    order = Column(Integer, default=0)
    
    architecture = relationship("Architecture", back_populates="apis")
    
    def __repr__(self):
        return f"<API({self.method} {self.endpoint})>"


class Component(Base):
    """System component"""
    __tablename__ = "components"
    
    id = Column(Integer, primary_key=True, index=True)
    architecture_id = Column(Integer, ForeignKey("architectures.id", ondelete="CASCADE"), nullable=False)
    
    component_name = Column(String(255), nullable=False)
    description = Column(Text)
    order = Column(Integer, default=0)
    
    architecture = relationship("Architecture", back_populates="components")
    
    def __repr__(self):
        return f"<Component(name={self.component_name})>"


class RoadmapPhase(Base):
    """Development roadmap phase"""
    __tablename__ = "roadmap_phases"
    
    id = Column(Integer, primary_key=True, index=True)
    architecture_id = Column(Integer, ForeignKey("architectures.id", ondelete="CASCADE"), nullable=False)
    
    phase_name = Column(String(255), nullable=False)
    tasks = Column(Text, nullable=False)  # JSON array
    order = Column(Integer, default=0)
    
    architecture = relationship("Architecture", back_populates="roadmap_phases")
    
    def __repr__(self):
        return f"<RoadmapPhase(name={self.phase_name})>"


class UsageRecord(Base):
    """Track API usage for rate limiting and billing"""
    __tablename__ = "usage_records"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    endpoint = Column(String(255), nullable=False)
    tokens_used = Column(Integer, default=0)
    cost = Column(Float, default=0.0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    user = relationship("User", back_populates="usage_records")
    
    __table_args__ = (
        Index('idx_user_date', 'user_id', 'created_at'),
        Index('idx_usage_user_id', 'user_id'),
    )
    
    def __repr__(self):
        return f"<UsageRecord(user_id={self.user_id}, endpoint={self.endpoint})>"


class GeneratedArchitecture(Base):
    """Legacy table - kept for backward compatibility"""
    __tablename__ = "generated_architectures"
    
    id = Column(Integer, primary_key=True, index=True)
    idea = Column(Text, nullable=False)
    result = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    def __repr__(self):
        return f"<GeneratedArchitecture(id={self.id}, created_at={self.created_at})>"

