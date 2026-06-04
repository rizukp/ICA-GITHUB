@echo off
echo ================================================
echo ICA GitHub Trigger Service - API Test Script
echo ================================================
echo.

REM Check if server is running
curl -s http://localhost:3000/health >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Server is not running!
    echo Please start the server first using start.bat
    echo.
    pause
    exit /b 1
)

echo [INFO] Server is running. Testing endpoints...
echo.

echo ================================================
echo Test 1: Health Check
echo ================================================
curl -X GET http://localhost:3000/health
echo.
echo.

echo ================================================
echo Test 2: List Workflows (requires API key)
echo ================================================
echo Enter your API key (or press Enter to skip):
set /p API_KEY=
if not "%API_KEY%"=="" (
    curl -X GET http://localhost:3000/workflows -H "x-api-key: %API_KEY%"
    echo.
) else (
    echo Skipped.
)
echo.

echo ================================================
echo Test 3: Trigger Workflow (requires API key)
echo ================================================
if not "%API_KEY%"=="" (
    echo Triggering test workflow...
    curl -X POST http://localhost:3000/trigger-workflow ^
      -H "Content-Type: application/json" ^
      -H "x-api-key: %API_KEY%" ^
      -d "{\"workflow_id\":\"main.yml\",\"ref\":\"main\",\"inputs\":{\"task\":\"test\",\"environment\":\"development\",\"message\":\"Test from API script\"}}"
    echo.
) else (
    echo Skipped (no API key provided).
)
echo.

echo ================================================
echo Tests completed!
echo ================================================
echo.
pause

@REM Made with Bob
