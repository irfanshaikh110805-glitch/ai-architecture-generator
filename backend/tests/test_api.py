import pytest
from fastapi import status

def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["message"] == "AI Architecture Generator API"
    assert data["status"] == "running"
    assert data["version"] == "2.0.0"

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "healthy"
    assert "model" in data

def test_generate_architecture_too_short(client):
    payload = {"idea": "Hi"}
    response = client.post("/api/v1/generate", json=payload)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

def test_generate_architecture_too_long(client):
    payload = {"idea": "a" * 5001}
    response = client.post("/api/v1/generate", json=payload)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

# Note: The following tests require a valid API key with available quota
# They are commented out to avoid test failures due to API limits
# Uncomment when you have sufficient API quota

# def test_generate_architecture_valid_input(client):
#     payload = {"idea": "A social media platform for pet owners"}
#     response = client.post("/api/v1/generate", json=payload)
#     assert response.status_code == status.HTTP_200_OK
#     data = response.json()
#     
#     # Verify response structure
#     assert "features" in data
#     assert "database" in data
#     assert "apis" in data
#     assert "architecture" in data
#     assert "erDiagram" in data
#     assert "architectureDiagram" in data
#     assert "roadmap" in data
#     assert "estimation" in data

# def test_generate_architecture_xss_attempt(client):
#     payload = {"idea": "<script>alert('xss')</script>Build a blog platform"}
#     response = client.post("/api/v1/generate", json=payload)
#     # Should sanitize and process
#     assert response.status_code == status.HTTP_200_OK

# def test_generate_architecture_sql_injection_attempt(client):
#     payload = {"idea": "test'; DROP TABLE users; -- Build an app"}
#     response = client.post("/api/v1/generate", json=payload)
#     # Should sanitize and process
#     assert response.status_code == status.HTTP_200_OK
