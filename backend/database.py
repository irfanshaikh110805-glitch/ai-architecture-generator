from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base
from alembic.config import Config
from alembic import command
import logging
import os

logger = logging.getLogger(__name__)

DATABASE_URL = "sqlite:///./architecture_generator.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """Initialize database with tables"""
    Base.metadata.create_all(bind=engine)

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
        
        from sqlalchemy import inspect, text
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        # Check if we need to stamp (table exists but no alembic tracking or tracking is empty)
        needs_stamp = False
        if "generated_architectures" in tables:
            if "alembic_version" not in tables:
                needs_stamp = True
            else:
                with engine.connect() as conn:
                    version = conn.execute(text("SELECT version_num FROM alembic_version")).fetchone()
                    if not version:
                        needs_stamp = True
        
        if needs_stamp:
            logger.info("Existing database detected without Alembic tracking. Stamping to head...")
            command.stamp(alembic_cfg, "head")
        else:
            command.upgrade(alembic_cfg, "head")

        logger.info("Database migrations applied successfully")
    except Exception as e:
        logger.error(f"Failed to run migrations: {e}")
        if os.getenv("ENVIRONMENT") == "production":
            raise

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
