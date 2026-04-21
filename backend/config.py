"""
Environment-specific configuration management
"""
import os
from enum import Enum
from typing import Dict, Any


class Environment(str, Enum):
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"


class Config:
    """Base configuration"""
    
    # Environment
    ENVIRONMENT: Environment = Environment.DEVELOPMENT
    DEBUG: bool = True
    
    # API
    API_VERSION: str = "v1"
    API_TITLE: str = "AI Architecture Generator API"
    API_DESCRIPTION: str = "Generate production-ready system architectures using Gemini AI"
    
    # Database
    DATABASE_URL: str = "sqlite:///./architecture_generator.db"
    DATABASE_POOL_SIZE: int = 5
    DATABASE_MAX_OVERFLOW: int = 10
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    ALLOWED_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW: int = 900  # 15 minutes
    
    # AI Service
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    AI_MODEL: str = "gemini-2.0-flash"
    AI_TIMEOUT: int = 60
    # Note: Free tier has quota limits. When exceeded, app returns fallback template.
    # Monitor usage at: https://aistudio.google.com/app/apikey
    
    # Monitoring
    SENTRY_DSN: str = os.getenv("SENTRY_DSN", "")
    ENABLE_METRICS: bool = True
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"
    
    # Request limits
    MAX_REQUEST_SIZE: int = 10 * 1024 * 1024  # 10 MB
    REQUEST_TIMEOUT: int = 60
    
    @classmethod
    def from_env(cls) -> "Config":
        """Create config from environment variables"""
        env = os.getenv("ENVIRONMENT", "development").lower()
        
        if env == "production":
            return ProductionConfig()
        elif env == "staging":
            return StagingConfig()
        else:
            return DevelopmentConfig()


class DevelopmentConfig(Config):
    """Development environment configuration"""
    
    ENVIRONMENT = Environment.DEVELOPMENT
    DEBUG = True
    LOG_LEVEL = "DEBUG"
    
    # More permissive rate limits for development
    RATE_LIMIT_REQUESTS = 1000
    RATE_LIMIT_WINDOW = 900


class StagingConfig(Config):
    """Staging environment configuration"""
    
    ENVIRONMENT = Environment.STAGING
    DEBUG = False
    LOG_LEVEL = "INFO"
    
    # Staging-specific database
    DATABASE_URL = os.getenv("STAGING_DATABASE_URL", "sqlite:///./staging.db")
    
    # Staging origins
    ALLOWED_ORIGINS = [
        "https://staging.yourdomain.com",
        "http://localhost:5173"
    ]


class ProductionConfig(Config):
    """Production environment configuration"""
    
    ENVIRONMENT = Environment.PRODUCTION
    DEBUG = False
    LOG_LEVEL = "WARNING"
    
    # Production database (should be PostgreSQL or similar)
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "postgresql://user:password@localhost/ai_arch_generator"
    )
    
    # Production origins
    ALLOWED_ORIGINS = [
        "https://yourdomain.com",
        "https://www.yourdomain.com"
    ]
    
    # Stricter rate limits
    RATE_LIMIT_REQUESTS = 50
    RATE_LIMIT_WINDOW = 900
    
    # Require Sentry in production
    @classmethod
    def validate(cls):
        """Validate production configuration"""
        if not os.getenv("SENTRY_DSN"):
            raise ValueError("SENTRY_DSN must be set in production")
        if not os.getenv("GEMINI_API_KEY"):
            raise ValueError("GEMINI_API_KEY must be set in production")
        if cls.SECRET_KEY == "dev-secret-key-change-in-production":
            raise ValueError("SECRET_KEY must be changed in production")


# Global config instance
config = Config.from_env()
