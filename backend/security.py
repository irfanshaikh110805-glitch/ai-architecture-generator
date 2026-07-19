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
    SECRET_KEY = os.getenv("SECRET_KEY")
    ALLOWED_ORIGINS = [origin.strip() for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")]
    RATE_LIMIT_REQUESTS = int(os.getenv("RATE_LIMIT_REQUESTS", "100"))
    RATE_LIMIT_WINDOW = int(os.getenv("RATE_LIMIT_WINDOW", "900"))  # 15 minutes in seconds
    
    # Validation limits
    MAX_INPUT_LENGTH = 5000
    MIN_INPUT_LENGTH = 10
    
    # Password requirements
    MIN_PASSWORD_LENGTH = 12
    PASSWORD_REQUIRE_UPPERCASE = True
    PASSWORD_REQUIRE_LOWERCASE = True
    PASSWORD_REQUIRE_DIGIT = True
    PASSWORD_REQUIRE_SPECIAL = True
    
    @classmethod
    def validate_secret_key(cls):
        """Ensure SECRET_KEY is properly configured"""
        env = os.getenv("ENVIRONMENT", "development")
        
        # Always require SECRET_KEY to be set
        if not cls.SECRET_KEY:
            raise ValueError(
                "CRITICAL SECURITY ERROR: SECRET_KEY environment variable must be set. "
                "Generate one with: python -c \"import secrets; print(secrets.token_urlsafe(32))\""
            )
        
        # Enforce minimum length in all environments
        if len(cls.SECRET_KEY) < 32:
            raise ValueError(
                f"CRITICAL SECURITY ERROR: SECRET_KEY must be at least 32 characters long "
                f"(current: {len(cls.SECRET_KEY)} characters). "
                "Generate a secure key with: python -c \"import secrets; print(secrets.token_urlsafe(32))\""
            )
        
        # Warn about weak patterns
        weak_patterns = ["dev", "test", "secret", "password", "changeme", "example"]
        if env == "production" and any(pattern in cls.SECRET_KEY.lower() for pattern in weak_patterns):
            raise ValueError(
                "CRITICAL SECURITY ERROR: SECRET_KEY contains weak patterns in production. "
                "Generate a cryptographically secure key."
            )


    @classmethod
    def validate_password_strength(cls, password: str) -> tuple[bool, str]:
        """
        Validate password meets security requirements
        Returns: (is_valid, error_message)
        """
        if len(password) < cls.MIN_PASSWORD_LENGTH:
            return False, f"Password must be at least {cls.MIN_PASSWORD_LENGTH} characters long"
        
        if cls.PASSWORD_REQUIRE_UPPERCASE and not any(c.isupper() for c in password):
            return False, "Password must contain at least one uppercase letter"
        
        if cls.PASSWORD_REQUIRE_LOWERCASE and not any(c.islower() for c in password):
            return False, "Password must contain at least one lowercase letter"
        
        if cls.PASSWORD_REQUIRE_DIGIT and not any(c.isdigit() for c in password):
            return False, "Password must contain at least one digit"
        
        if cls.PASSWORD_REQUIRE_SPECIAL:
            special_chars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
            if not any(c in special_chars for c in password):
                return False, f"Password must contain at least one special character ({special_chars})"
        
        # Check for common weak passwords
        common_passwords = ["password", "123456", "qwerty", "admin", "letmein", "welcome"]
        if password.lower() in common_passwords:
            return False, "Password is too common. Please choose a stronger password"
        
        return True, ""


# Input Sanitization
def sanitize_html(text: str) -> str:
    """Remove any HTML tags and dangerous content"""
    # Remove script and style tags and their contents
    text = re.sub(r'(?is)<(script|style).*?>.*?</\1>', '', text)
    return bleach.clean(text, tags=[], strip=True)


def sanitize_input(text: str, allow_html: bool = False) -> str:
    """
    Comprehensive input sanitization
    - Remove XSS vectors
    - Trim whitespace
    
    Note: SQL injection protection is handled by SQLAlchemy's parameterized queries.
    Do not use raw SQL queries without proper parameterization.
    """
    if not text:
        return ""
    
    # Remove HTML if not allowed
    if not allow_html:
        text = sanitize_html(text)
    
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
