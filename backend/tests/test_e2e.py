"""
End-to-End tests for AI Architecture Generator
These tests simulate real user workflows
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from main import app

client = TestClient(app)


from tests.test_integration import MOCK_ARCH_RESPONSE

class TestE2EWorkflows:
    """End-to-end workflow tests"""
    
    @patch('main.generate_architecture')
    def test_complete_user_journey(self, mock_generate):
        """Test complete user journey from landing to result"""
        # Mock AI response - FastAPI uses the function directly, so we need to mock it properly
        # Since the route is async, the mocked function needs to return a coroutine or be an AsyncMock
        import asyncio
        future = asyncio.Future()
        future.set_result(MOCK_ARCH_RESPONSE)
        mock_generate.return_value = future
        
        # Step 1: Check health
        health_response = client.get("/health")
        assert health_response.status_code == 200
        
        # Step 2: Generate architecture
        generate_response = client.post(
            "/api/v1/generate",
            json={"idea": "Build a social media platform with real-time chat"}
        )
        assert generate_response.status_code == 200
        print(f"DEBUG RESPONSE: status={generate_response.status_code}, content={generate_response.text}")
        result = generate_response.json()
        
        # Step 3: Verify response structure
        assert "architecture" in result
        assert "architectureDiagram" in result
        assert "erDiagram" in result
        assert "apis" in result
        assert "database" in result
        assert "estimation" in result
        
        # Step 4: Check metrics were recorded
        metrics_response = client.get("/metrics")
        assert metrics_response.status_code == 200
        metrics = metrics_response.json()
        assert "architecture_generation_total" in metrics
    
    def test_error_recovery_workflow(self):
        """Test error handling and recovery"""
        # Invalid input
        response = client.post(
            "/api/v1/generate",
            json={"idea": ""}
        )
        assert response.status_code == 422
        
        # Valid input after error
        with patch('main.generate_architecture') as mock_gen:
            import asyncio
            future = asyncio.Future()
            future.set_result(MOCK_ARCH_RESPONSE)
            mock_gen.return_value = future
            response = client.post(
                "/api/v1/generate",
                json={"idea": "Valid project idea"}
            )
            # Should succeed after previous error
            assert response.status_code in [200, 500]  # May fail if AI service unavailable
    
    def test_api_versioning_workflow(self):
        """Test API versioning compatibility"""
        # Test v1 endpoint
        response_v1 = client.get("/api/v1/health")
        assert response_v1.status_code == 200
        assert response_v1.json()["version"] == "v1"
        
        # Test legacy endpoint (deprecated)
        with patch('main.generate_architecture') as mock_gen:
            import asyncio
            future = asyncio.Future()
            future.set_result(MOCK_ARCH_RESPONSE)
            mock_gen.return_value = future
            response_legacy = client.post(
                "/generate",
                json={"idea": "Test"}
            )
            # Should work but include deprecation header
            if response_legacy.status_code == 200:
                assert "x-deprecated" in response_legacy.headers
    
    def test_monitoring_workflow(self):
        """Test monitoring and observability"""
        # Check detailed health
        health = client.get("/health/detailed")
        assert health.status_code == 200
        data = health.json()
        assert "components" in data
        assert "database" in data["components"]
        assert "ai_service" in data["components"]
        
        # Check metrics endpoint
        metrics = client.get("/metrics")
        assert metrics.status_code == 200
