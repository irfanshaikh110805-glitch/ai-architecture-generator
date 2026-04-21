@echo off
echo ========================================
echo Starting AI Architecture Generator Backend
echo ========================================
echo.
echo Security Features Enabled:
echo - Rate Limiting: 100 requests per 15 minutes
echo - Input Validation and Sanitization
echo - XSS Prevention
echo - SQL Injection Prevention
echo - Security Headers
echo - CORS Protection
echo.
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
