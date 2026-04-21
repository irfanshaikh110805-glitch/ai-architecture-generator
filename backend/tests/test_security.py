import pytest
from security import (
    sanitize_html,
    sanitize_sql_input,
    sanitize_input,
    validate_input_length,
    SecurityConfig
)

def test_sanitize_html():
    assert sanitize_html("<script>alert('xss')</script>Hello") == "Hello"
    assert sanitize_html("<b>Bold</b> text") == "Bold text"
    assert sanitize_html("Normal text") == "Normal text"

def test_sanitize_sql_input():
    assert "DROP" not in sanitize_sql_input("test'; DROP TABLE users; --")
    assert "UNION" not in sanitize_sql_input("test UNION SELECT * FROM users")
    assert sanitize_sql_input("Normal query text") == "Normal query text"

def test_sanitize_input():
    # XSS prevention
    result = sanitize_input("<script>alert('xss')</script>Hello")
    assert "<script>" not in result
    
    # SQL injection prevention
    result = sanitize_input("test'; DROP TABLE users; --")
    assert "DROP" not in result
    
    # Null byte removal
    result = sanitize_input("test\x00data")
    assert "\x00" not in result

def test_validate_input_length():
    # Valid length
    is_valid, error = validate_input_length("Valid input text")
    assert is_valid is True
    assert error is None
    
    # Too short
    is_valid, error = validate_input_length("Hi")
    assert is_valid is False
    assert "too short" in error.lower()
    
    # Too long
    is_valid, error = validate_input_length("a" * 5001)
    assert is_valid is False
    assert "too long" in error.lower()

def test_security_config():
    assert SecurityConfig.MAX_INPUT_LENGTH == 5000
    assert SecurityConfig.MIN_INPUT_LENGTH == 10
    assert isinstance(SecurityConfig.ALLOWED_ORIGINS, list)
