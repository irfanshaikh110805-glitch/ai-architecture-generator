@echo off
echo ========================================
echo  Clearing Cache and Restarting Frontend
echo ========================================
echo.
echo Step 1: Clearing Vite cache...
cd frontend
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
    echo ✓ Vite cache cleared
) else (
    echo ✓ No Vite cache found
)
echo.
echo Step 2: Starting fresh dev server...
echo.
echo IMPORTANT: After the server starts:
echo 1. Open Chrome DevTools (F12)
echo 2. Right-click the refresh button
echo 3. Click "Empty Cache and Hard Reload"
echo    OR
echo    Clear Site Data from Application tab
echo.
npm run dev
