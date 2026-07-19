@echo off
echo ======================================
echo  Checking for Duplicate React Packages
echo ======================================
echo.
cd frontend
echo Checking React:
npm ls react
echo.
echo ======================================
echo Checking React-DOM:
npm ls react-dom
echo.
echo ======================================
echo.
echo If you see multiple versions listed above, run:
echo   npm dedupe
echo.
pause
