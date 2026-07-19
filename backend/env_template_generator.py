"""
Generate secure environment template and validate existing .env files
"""
import secrets
import os
from pathlib import Path


def generate_secure_key(length: int = 32) -> str:
    """Generate a cryptographically secure random key"""
    return secrets.token_urlsafe(length)


def create_env_template():
    """Create a secure .env.example template"""
    template = f"""# API Keys
# SECURITY WARNING: Replace with your own API key
# Get your key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your-gemini-api-key-here

# Database - Supabase PostgreSQL
# Get your connection string from: Supabase Dashboard > Settings > Database
# Use Session Pooler (IPv4 compatible) with port 6543
DATABASE_URL=postgresql+asyncpg://postgres:YOUR_PASSWORD@YOUR_PROJECT.pooler.supabase.com:6543/postgres?prepared_statement_cache_size=0

# Security Keys
# CRITICAL: Generate new secure keys using the commands below:
# python -c "import secrets; print(secrets.token_urlsafe(32))"
SECRET_KEY={generate_secure_key()}
JWT_SECRET_KEY={generate_secure_key()}

# CORS Configuration
# Add your frontend URLs (comma-separated)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=900

# Environment
ENVIRONMENT=development

# Optional: Redis for caching
# REDIS_URL=redis://localhost:6379

# Optional: Sentry for error tracking
# SENTRY_DSN=your-sentry-dsn-here

# Optional: Email configuration
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASSWORD=your-app-password
# SMTP_FROM=noreply@yourdomain.com
"""
    return template


def check_env_security(env_path: Path) -> list[str]:
    """Check .env file for security issues"""
    issues = []
    
    if not env_path.exists():
        return ["File does not exist"]
    
    with open(env_path, 'r') as f:
        content = f.read()
    
    # Check for weak secret keys
    weak_patterns = [
        "dev-secret-key",
        "change-in-production",
        "your-secret-key",
        "example",
        "test",
        "password",
        "changeme"
    ]
    
    for pattern in weak_patterns:
        if pattern.lower() in content.lower():
            issues.append(f"⚠️  WARNING: Found weak pattern '{pattern}' in {env_path.name}")
    
    # Check for placeholder values
    placeholders = [
        "your-gemini-api-key-here",
        "YOUR_PASSWORD",
        "YOUR_PROJECT",
        "your-sentry-dsn-here"
    ]
    
    for placeholder in placeholders:
        if placeholder in content:
            issues.append(f"❌ ERROR: Placeholder '{placeholder}' found in {env_path.name}. Replace with actual value.")
    
    # Check key lengths
    lines = content.split('\n')
    for line in lines:
        if '=' in line and not line.strip().startswith('#'):
            key, value = line.split('=', 1)
            key = key.strip()
            value = value.strip()
            
            if key in ['SECRET_KEY', 'JWT_SECRET_KEY']:
                if len(value) < 32:
                    issues.append(f"❌ ERROR: {key} is too short ({len(value)} chars). Must be at least 32 characters.")
    
    return issues


def main():
    """Main function"""
    print("=" * 70)
    print("  SECURE ENVIRONMENT CONFIGURATION TOOL")
    print("=" * 70)
    print()
    
    # Get script directory (backend folder)
    script_dir = Path(__file__).parent
    
    # Generate template
    template = create_env_template()
    template_path = script_dir / ".env.example"
    
    print(f"✅ Generated secure .env.example template at: {template_path}")
    print()
    
    # Write template
    with open(template_path, 'w') as f:
        f.write(template)
    
    # Check existing .env if it exists
    env_path = script_dir / ".env"
    
    if env_path.exists():
        print("🔍 Checking existing .env file for security issues...")
        print()
        issues = check_env_security(env_path)
        
        if issues:
            print("❌ SECURITY ISSUES FOUND:")
            print()
            for issue in issues:
                print(f"  {issue}")
            print()
            print("⚠️  PLEASE FIX THESE ISSUES BEFORE DEPLOYMENT!")
        else:
            print("✅ No obvious security issues found in .env file")
        print()
    else:
        print(f"ℹ️  No .env file found. Copy .env.example to .env and configure:")
        print(f"   cp {template_path} {env_path}")
        print()
    
    # Instructions
    print("=" * 70)
    print("  NEXT STEPS:")
    print("=" * 70)
    print()
    print("1. Copy .env.example to .env:")
    print(f"   copy {template_path} {env_path}")
    print()
    print("2. Edit .env and replace all placeholder values with actual credentials")
    print()
    print("3. Generate secure keys:")
    print('   python -c "import secrets; print(secrets.token_urlsafe(32))"')
    print()
    print("4. NEVER commit .env files to git!")
    print("   (Already protected by .gitignore)")
    print()
    print("5. For production, use environment variables in your hosting platform")
    print()
    print("=" * 70)


if __name__ == "__main__":
    main()
