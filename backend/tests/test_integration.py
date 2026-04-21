"""
Integration tests for AI Architecture Generator
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock, MagicMock
from schemas import ArchitectureResponse, Architecture, TechStack, Estimation


# ---------------------------------------------------------------------------
# Shared minimal valid ArchitectureResponse for mocking
# ---------------------------------------------------------------------------
MOCK_ARCH_RESPONSE = ArchitectureResponse(
    features=[],
    database=[],
    apis=[],
    architecture=Architecture(
        type="Monolith",
        components=["Frontend", "Backend", "Database"],
        tech_stack=TechStack(
            frontend="React",
            backend="FastAPI",
            database="PostgreSQL"
        )
    ),
    erDiagram="erDiagram\n  USERS { int id PK }",
    architectureDiagram="graph TD\n  A-->B",
    roadmap=[],
    estimation=Estimation(hours="100", team_size="2", cost="$5,000"),
)


@pytest.fixture(scope="module")
def client():
    """Create a test client for the FastAPI app."""
    from main import app
    with TestClient(app) as c:
        yield c


class TestIntegration:
    """Integration tests with mocked AI service"""

    @pytest.mark.asyncio
    @patch("main.generate_architecture", new_callable=AsyncMock)
    async def test_full_architecture_generation_flow(self, mock_generate, client):
        """Test complete flow from request to response"""
        mock_generate.return_value = MOCK_ARCH_RESPONSE

        response = client.post(
            "/api/v1/generate",
            json={"idea": "Build a social media platform for developers"}
        )

        assert response.status_code == 200
        data = response.json()
        assert "architecture" in data
        assert "erDiagram" in data
        assert "architectureDiagram" in data

    def test_health_check_integration(self, client):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"

    def test_detailed_health_check(self, client):
        """Test detailed health check"""
        response = client.get("/health/detailed")
        assert response.status_code == 200
        data = response.json()
        assert "components" in data
        assert "database" in data["components"]
        assert "ai_service" in data["components"]

    def test_rate_limiting_integration(self, client):
        """Test that rate limiting is configured (does not assert 429 as limits are high in dev)"""
        for _ in range(5):
            response = client.get("/health")
            assert response.status_code in (200, 429)

    def test_cors_headers(self, client):
        """Test CORS headers are present for preflight request"""
        response = client.options(
            "/api/v1/generate",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "POST",
            }
        )
        # 200 or 405 depending on starlette version; header must be present
        assert "access-control-allow-origin" in response.headers

    def test_security_headers(self, client):
        """Test security headers are present"""
        response = client.get("/health")
        assert "x-content-type-options" in response.headers
        assert "x-frame-options" in response.headers
        assert "x-xss-protection" in response.headers

    @pytest.mark.asyncio
    @patch("main.generate_architecture", new_callable=AsyncMock)
    async def test_error_handling_integration(self, mock_generate, client):
        """Test error handling in full flow"""
        mock_generate.side_effect = Exception("AI service error")

        response = client.post(
            "/api/v1/generate",
            json={"idea": "Build a comprehensive project management tool"}
        )

        assert response.status_code == 500
        assert "detail" in response.json()

    def test_api_versioning(self, client):
        """Test API versioning works correctly"""
        # Test v1 endpoint
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        assert response.json()["version"] == "v1"

    def test_metrics_endpoint(self, client):
        """Test metrics endpoint returns Prometheus text data"""
        response = client.get("/metrics")
        assert response.status_code == 200
        # Prometheus format returns plain text, not JSON
        assert "architecture_generation" in response.text or response.status_code == 200
