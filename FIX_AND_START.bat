@echo off
echo ========================================
echo AI Architecture Generator - Quick Start
echo ========================================
echo.

echo Step 1: Installing Backend Dependencies...
echo ==========================================
cd backend
call venv\Scripts\activate
echo Installing required packages...
pip install -r requirements.txt
echo.

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

echo ========================================
echo Step 2: Starting Backend Server...
echo ========================================
echo Backend will start on http://localhost:8000
echo API Docs will be at http://localhost:8000/docs
echo.
start "Backend Server" cmd /k "cd /d %CD% && venv\Scripts\activate && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

cd ..

echo.
echo ========================================
echo Step 3: Installing Frontend Dependencies...
echo ========================================
cd frontend
if not exist "node_modules" (
    echo Installing Node.js packages...
    call npm install
    echo.
) else (
    echo Node modules already installed, skipping...
)

echo.
echo ========================================
echo Step 4: Starting Frontend Server...
echo ========================================
echo Frontend will start on http://localhost:5173
echo.
start "Frontend Server" cmd /k "cd /d %CD% && npm run dev"

echo.
echo ========================================
echo SUCCESS! Both servers are starting...
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo Frontend: http://localhost:5173
echo.
echo Two new windows should have opened:
echo 1. Backend Server (black window)
echo 2. Frontend Server (black window)
echo.
echo Your browser should automatically open to:
echo http://localhost:5173
echo.
echo If not, manually open: http://localhost:5173
echo.
echo To STOP the servers:
echo - Press CTRL+C in each server window
echo - Or close the server windows
echo.
echo ========================================
timeout /t 3 /nobreak >nul
start http://localhost:5173
echo.
echo Done! You can close this window now.
pause
