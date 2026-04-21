"""
Environment variable validation on startup
"""
import os
import sys
import logging
from typing import List, Tuple

logger = logging.getLogger(__name__)

class EnvironmentValidator:
    """Validate required environment variables"""
    
    REQUIRED_VARS = [
        ("GEMINI_API_KEY", "Gemini API key for AI generation"),
        ("SECRET_KEY", "Secret key for security (min 32 chars)"),
    ]
    
    OPTIONAL_VARS = [
        ("ALLOWED_ORIGINS", "CORS allowed origins"),
        ("RATE_LIMIT_REQUESTS", "Rate limit requests per window"),
        ("RATE_LIMIT_WINDOW", "Rate limit window in seconds"),
        ("ENVIRONMENT", "Environment (development/production)"),
        ("SENTRY_DSN", "Sentry DSN for error tracking"),
    ]
    
    @classmethod
    def validate(cls) -> Tuple[bool, List[str]]:
        """
        Validate all environment variables
        
        Returns:
            Tuple of (is_valid, list of error messages)
        """
        errors = []
        warnings = []
        
        # Check required variables
        for var_name, description in cls.REQUIRED_VARS:
            value = os.getenv(var_name)
            
            if not value:
                errors.append(f"❌ {var_name} is not set ({description})")
            elif value in ["your_gemini_api_key_here", "your-secret-key-here-min-32-chars"]:
                errors.append(f"❌ {var_name} is using default/placeholder value")
            elif var_name == "SECRET_KEY" and len(value) < 32:
                errors.append(f"❌ {var_name} must be at least 32 characters long")
            else:
                logger.info(f"✓ {var_name} is configured")
        
        # Check optional variables
        for var_name, description in cls.OPTIONAL_VARS:
            value = os.getenv(var_name)
            
            if not value:
                warnings.append(f"⚠ {var_name} is not set, using default ({description})")
            else:
                logger.info(f"✓ {var_name} is configured")
        
        # Environment-specific checks
        environment = os.getenv("ENVIRONMENT", "development")
        if environment == "production":
            secret_key = os.getenv("SECRET_KEY", "")
            if secret_key == "dev-secret-key-change-in-production":
                errors.append("❌ Using development SECRET_KEY in production!")
            
            if not os.getenv("SENTRY_DSN"):
                warnings.append("⚠ SENTRY_DSN not set in production (error tracking disabled)")
        
        # Print warnings
        for warning in warnings:
            logger.warning(warning)
        
        # Print errors
        for error in errors:
            logger.error(error)
        
        is_valid = len(errors) == 0
        return is_valid, errors
    
    @classmethod
    def validate_or_exit(cls):
        """Validate environment and exit if invalid"""
        is_valid, errors = cls.validate()
        
        if not is_valid:
            logger.error("\n❌ Environment validation failed!")
            logger.error("Please check your .env file and ensure all required variables are set.")
            logger.error("\nErrors:")
            for error in errors:
                logger.error(f"  {error}")
            logger.error("\nSee .env.example for reference.")
            sys.exit(1)
        else:
            logger.info("✓ Environment validation passed")


if __name__ == "__main__":
    # Run validation
    from dotenv import load_dotenv
    load_dotenv()
    
    logging.basicConfig(level=logging.INFO)
    EnvironmentValidator.validate_or_exit()
    print("\n✓ All environment variables are properly configured!")
