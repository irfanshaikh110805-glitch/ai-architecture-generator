@echo off
echo ======================================
echo  Restarting Frontend Development Server
echo ======================================
echo.
echo Please make sure to close the existing dev server first!
echo Press Ctrl+C in the terminal running "npm run dev"
echo.
pause
echo.
echo Starting fresh frontend server...
cd frontend
npm run dev
