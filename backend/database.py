from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import sessionmaker
from models import Base
from alembic.config import Config
from alembic import command
import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

# Get database URL from environment or use SQLite as fallback
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./architecture_generator.db")

# Convert postgresql:// to postgresql+asyncpg:// for async support
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

# Create async engine with appropriate settings based on database type
if "postgresql" in DATABASE_URL:
    engine = create_async_engine(
        DATABASE_URL,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,
        pool_recycle=3600,
        echo=False
    )
else:
    # SQLite async settings
    engine = create_async_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False
    )

# Create async session maker
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

async def init_db():
    """Initialize database with tables"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

def run_migrations():
    """Run Alembic migrations automatically on startup"""
    try:
        # Get current directory for alembic.ini path
        current_dir = os.path.dirname(os.path.abspath(__file__))
        alembic_ini_path = os.path.join(current_dir, "alembic.ini")
        
        if not os.path.exists(alembic_ini_path):
            logger.warning(f"alembic.ini not found at {alembic_ini_path}, skipping migrations")
            return
        
        alembic_cfg = Config(alembic_ini_path)
        
        # Override sqlalchemy.url with environment variable
        # IMPORTANT: Use synchronous database URL for Alembic
        if DATABASE_URL:
            # Convert async URL to sync for Alembic
            sync_url = DATABASE_URL.replace("+asyncpg", "").replace("+aiosqlite", "")
            # For SQLite, use standard sqlite:/// instead of aiosqlite
            if "sqlite" in sync_url:
                sync_url = sync_url.replace("sqlite+aiosqlite", "sqlite")
            alembic_cfg.set_main_option("sqlalchemy.url", sync_url)
        
        # Run migrations in a way that doesn't trigger async context
        # This needs to be completely synchronous
        command.upgrade(alembic_cfg, "head")

        logger.info("Database migrations applied successfully")
    except Exception as e:
        logger.error(f"Failed to run migrations: {e}")
        # Don't raise in development to allow app to start
        if os.getenv("ENVIRONMENT") == "production":
            raise
        else:
            logger.warning("Continuing without migrations in development mode")

async def get_db() -> AsyncSession:
    """Async database session dependency"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
