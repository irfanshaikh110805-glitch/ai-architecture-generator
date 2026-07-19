@echo off
echo ===================================
echo   Starting Backend Server
echo ===================================
echo.

cd backend

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Starting FastAPI server on http://localhost:8000
echo Press CTRL+C to stop
echo.

python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

pause
