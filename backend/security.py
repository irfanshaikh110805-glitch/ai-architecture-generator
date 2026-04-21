"""
Security configuration and utilities
"""
import os
import re
import bleach
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

# Security Configuration
class SecurityConfig:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    ALLOWED_ORIGINS = [origin.strip() for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")]
    RATE_LIMIT_REQUESTS = int(os.getenv("RATE_LIMIT_REQUESTS", "100"))
    RATE_LIMIT_WINDOW = int(os.getenv("RATE_LIMIT_WINDOW", "900"))  # 15 minutes in seconds
    
    # Validation limits
    MAX_INPUT_LENGTH = 5000
    MIN_INPUT_LENGTH = 10
    
    @classmethod
    def validate_secret_key(cls):
        """Ensure SECRET_KEY is properly configured in production"""
        env = os.getenv("ENVIRONMENT", "development")
        if env == "production":
            if cls.SECRET_KEY == "dev-secret-key-change-in-production" or len(cls.SECRET_KEY) < 32:
                raise ValueError(
                    "CRITICAL SECURITY ERROR: SECRET_KEY must be set to a secure value "
                    "(minimum 32 characters) in production environment. "
                    "Set the SECRET_KEY environment variable before starting the application."
                )
        elif len(cls.SECRET_KEY) < 32:
            import warnings
            warnings.warn(
                f"SECRET_KEY is too short ({len(cls.SECRET_KEY)} chars). "
                "Use at least 32 characters for better security."
            )


# Input Sanitization
def sanitize_html(text: str) -> str:
    """Remove any HTML tags and dangerous content"""
    # Remove script and style tags and their contents
    text = re.sub(r'(?is)<(script|style).*?>.*?</\1>', '', text)
    return bleach.clean(text, tags=[], strip=True)


def sanitize_sql_input(text: str) -> str:
    """Basic SQL injection prevention - remove dangerous SQL keywords"""
    dangerous_patterns = [
        r"(\bDROP\b|\bDELETE\b|\bTRUNCATE\b|\bEXEC\b|\bEXECUTE\b)",
        r"(--|;|\/\*|\*\/)",
        r"(\bUNION\b.*\bSELECT\b)",
        r"(\bINSERT\b.*\bINTO\b)",
        r"(\bUPDATE\b.*\bSET\b)"
    ]
    
    cleaned = text
    for pattern in dangerous_patterns:
        cleaned = re.sub(pattern, "", cleaned, flags=re.IGNORECASE)
    
    return cleaned.strip()


def sanitize_input(text: str, allow_html: bool = False) -> str:
    """
    Comprehensive input sanitization
    - Remove XSS vectors
    - Remove SQL injection attempts
    - Trim whitespace
    """
    if not text:
        return ""
    
    # Remove HTML if not allowed
    if not allow_html:
        text = sanitize_html(text)
    
    # Remove SQL injection patterns
    text = sanitize_sql_input(text)
    
    # Remove null bytes
    text = text.replace("\x00", "")
    
    return text.strip()


def validate_input_length(text: str, min_length: Optional[int] = None, max_length: Optional[int] = None) -> tuple[bool, Optional[str]]:
    """
    Validate input length
    Returns: (is_valid, error_message)
    """
    min_len = min_length or SecurityConfig.MIN_INPUT_LENGTH
    max_len = max_length or SecurityConfig.MAX_INPUT_LENGTH
    
    if len(text) < min_len:
        return False, f"Input too short. Minimum {min_len} characters required."
    
    if len(text) > max_len:
        return False, f"Input too long. Maximum {max_len} characters allowed."
    
    return True, None
