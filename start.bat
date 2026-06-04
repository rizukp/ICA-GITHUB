@echo off
echo ================================================
echo ICA GitHub Trigger Service - Startup Script
echo ================================================
echo.

REM Check if .env file exists
if not exist .env (
    echo [ERROR] .env file not found!
    echo.
    echo Please create a .env file from .env.example:
    echo   1. Copy .env.example to .env
    echo   2. Fill in your GitHub token and API key
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist node_modules (
    echo [INFO] node_modules not found. Installing dependencies...
    echo.
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
)

echo [INFO] Starting Node.js service...
echo.
echo Press Ctrl+C to stop the server
echo.
echo ================================================
echo.

node server.js

@REM Made with Bob
