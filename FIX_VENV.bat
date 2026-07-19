@echo off
echo ====================================
echo   Fixing Virtual Environment
echo ====================================
echo.

cd backend

echo Step 1: Removing old venv folder...
if exist venv (
    rmdir /s /q venv
    echo Old venv removed.
) else (
    echo No old venv found.
)

echo.
echo Step 2: Creating new virtual environment...
python -m venv venv

echo.
echo Step 3: Activating venv...
call venv\Scripts\activate.bat

echo.
echo Step 4: Upgrading pip...
python -m pip install --upgrade pip

echo.
echo Step 5: Installing requirements...
pip install -r requirements.txt

echo.
echo ====================================
echo   Virtual Environment Fixed!
echo ====================================
echo.
echo You can now run:
echo   START_BACKEND.bat
echo.
pause
