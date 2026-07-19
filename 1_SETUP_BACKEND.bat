@echo off
echo ================================
echo Setting Up Backend Environment
echo ================================
echo.

cd backend

echo Creating virtual environment...
python -m venv venv

echo.
echo Activating virtual environment...
call venv\Scripts\activate

echo.
echo Installing dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

echo.
echo ================================
echo Backend Setup Complete!
echo ================================
echo.
echo Next: Run "2_START_BACKEND.bat" to start the server
echo.
pause
