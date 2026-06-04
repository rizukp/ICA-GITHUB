# PowerShell script to test the ICA GitHub Trigger Service API
# Usage: .\test-api.ps1

# Load API key from .env file
$envFile = Get-Content .env
$apiKey = ($envFile | Where-Object { $_ -match '^API_KEY=' }) -replace 'API_KEY=', ''

if (-not $apiKey) {
    Write-Host "Error: API_KEY not found in .env file" -ForegroundColor Red
    exit 1
}

$baseUrl = "http://localhost:3000"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing ICA GitHub Trigger Service API" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Yellow
Write-Host "GET $baseUrl/health" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "✓ Success" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: List Workflows
Write-Host "Test 2: List Workflows" -ForegroundColor Yellow
Write-Host "GET $baseUrl/workflows" -ForegroundColor Gray
try {
    $headers = @{
        "x-api-key" = $apiKey
    }
    $response = Invoke-RestMethod -Uri "$baseUrl/workflows" -Method Get -Headers $headers
    Write-Host "✓ Success" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Trigger Workflow
Write-Host "Test 3: Trigger Workflow" -ForegroundColor Yellow
Write-Host "POST $baseUrl/trigger-workflow" -ForegroundColor Gray
try {
    $headers = @{
        "Content-Type" = "application/json"
        "x-api-key" = $apiKey
    }
    $body = @{
        workflow_id = "main.yml"
        ref = "main"
        inputs = @{
            task = "test"
            environment = "development"
            message = "Test from PowerShell script"
            debug = "false"
        }
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/trigger-workflow" -Method Post -Headers $headers -Body $body
    Write-Host "✓ Success" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Get Workflow Runs
Write-Host "Test 4: Get Recent Workflow Runs" -ForegroundColor Yellow
Write-Host 'GET $baseUrl/workflow-runs?workflow_id=main.yml&per_page=5' -ForegroundColor Gray
try {
    $headers = @{
        "x-api-key" = $apiKey
    }
    $uri = $baseUrl + '/workflow-runs?workflow_id=main.yml&per_page=5'
    $response = Invoke-RestMethod -Uri $uri -Method Get -Headers $headers
    Write-Host "✓ Success" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Made with Bob
