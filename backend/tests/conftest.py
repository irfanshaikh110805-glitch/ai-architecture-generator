import os
import sys
import pytest
from pathlib import Path
from dotenv import load_dotenv
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add backend directory to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

# Load .env from backend directory if it exists
env_path = backend_dir / '.env'
if env_path.exists():
    load_dotenv(env_path)
else:
    # Try to load from current directory
    load_dotenv(verbose=False)

# Provide defaults for required vars if not already set (keeps tests self-contained)
os.environ.setdefault("GEMINI_API_KEY", "test-api-key-for-testing-only")
os.environ.setdefault("SECRET_KEY", "test-secret-key-at-least-32chars-long!")
os.environ.setdefault("ENVIRONMENT", "development")

from main import app
from models import Base
from database import get_db

# Test database
TEST_DATABASE_URL = "sqlite:///./test_architecture_generator.db"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(test_db):
    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
