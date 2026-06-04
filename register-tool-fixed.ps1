# Register GitHub Workflow Trigger Tool in Context Studio via REST API
# This script registers a custom tool that calls your local API service

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Register GitHub Workflow Trigger Tool" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Context Studio Configuration
$contextId = "ctx_f41f9d5f18a0"
$contextStudioKey = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbEFkZHJlc3MiOiJtdWhhbW1lZC5yaXp3YW5AaWJtLmNvbSIsInRlYW1JZCI6IjY3ZTY5NWNhYzM2NTVhMjkxY2QzZjIyYyIsImNvbnRleHRJZCI6ImN0eF9mNDFmOWQ1ZjE4YTAiLCJpYXQiOjE3ODA1Njk2MDUsImV4cCI6MTc4NTc1MzYwNSwiaXNzIjoiY29udGV4dC1icm9rZXIiLCJ0b2tlbl9pZCI6ImY4NjdlNzgzLWU2MDItNDBjOC05YjM5LTIzZDI4YjljOTI1ZCJ9.Dg-GJm5-8pv140lHiS-kIAS3G6i0Y1v-Lft5XzJaeIWtaGXmqdXjiAU2TTEzG0wgwlDYvfdRKCBxen5AHx8V7g"
$baseUrl = "https://servicesessentials.ibm.com/context-studio/api"

# Get API key from .env file
Write-Host "Reading API key from .env file..." -ForegroundColor Yellow
$envFile = Get-Content .env -ErrorAction SilentlyContinue
if ($envFile) {
    $apiKeyLine = $envFile | Where-Object { $_ -match '^API_KEY=' }
    if ($apiKeyLine) {
        $workflowApiKey = $apiKeyLine -replace 'API_KEY=', ''
        Write-Host "API key loaded from .env" -ForegroundColor Green
    } else {
        Write-Host "API_KEY not found in .env file" -ForegroundColor Yellow
        $workflowApiKey = Read-Host "Enter your API key manually"
    }
} else {
    Write-Host ".env file not found" -ForegroundColor Yellow
    $workflowApiKey = Read-Host "Enter your API key"
}

Write-Host ""
Write-Host "Configuration:" -ForegroundColor Cyan
Write-Host "  Context ID: $contextId" -ForegroundColor Gray
Write-Host "  API Endpoint: https://uprising-theme-maturity.ngrok-free.dev" -ForegroundColor Gray
Write-Host ""

# Tool configuration
$tool = @{
    context_id = $contextId
    name = "trigger_github_workflow"
    description = "Trigger a GitHub Actions workflow in the ICA-GITHUB repository"
    type = "rest_api"
    enabled = $true
    config = @{
        method = "POST"
        url = "https://uprising-theme-maturity.ngrok-free.dev/trigger-workflow"
        headers = @{
            "Content-Type" = "application/json"
            "x-api-key" = $workflowApiKey
        }
        body_template = @{
            workflow_id = "{{workflow_id}}"
            ref = "{{ref}}"
            inputs = @{
                task = "{{task}}"
                environment = "{{environment}}"
                message = "{{message}}"
                debug = "{{debug}}"
            }
        }
        parameters = @(
            @{
                name = "workflow_id"
                type = "string"
                description = "The workflow file name"
                required = $true
                default = "main.yml"
            },
            @{
                name = "ref"
                type = "string"
                description = "The git branch"
                required = $true
                default = "main"
            },
            @{
                name = "task"
                type = "string"
                description = "Task to execute"
                required = $false
                default = "deploy"
            },
            @{
                name = "environment"
                type = "string"
                description = "Target environment"
                required = $false
                default = "production"
            },
            @{
                name = "message"
                type = "string"
                description = "Custom message"
                required = $false
                default = "Triggered by ICA"
            },
            @{
                name = "debug"
                type = "string"
                description = "Enable debug mode"
                required = $false
                default = "false"
            }
        )
    }
}

# Convert to JSON
$toolJson = $tool | ConvertTo-Json -Depth 10

# API Headers
$headers = @{
    "Authorization" = "Bearer $contextStudioKey"
    "Content-Type" = "application/json"
}

Write-Host "Registering tool in Context Studio..." -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/tools" -Method Post -Headers $headers -Body $toolJson
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Tool Registered Successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Tool Details:" -ForegroundColor Cyan
    Write-Host "  Tool ID: $($response.tool_id)" -ForegroundColor White
    Write-Host "  Name: trigger_github_workflow" -ForegroundColor White
    Write-Host ""
    Write-Host "Full Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10 | Write-Host
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Restart ICA agent" -ForegroundColor White
    Write-Host "2. Test with: Deploy to production" -ForegroundColor White
    Write-Host "3. Verify on GitHub Actions" -ForegroundColor White
    
} catch {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "Error Registering Tool" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error Message:" -ForegroundColor Yellow
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    
    if ($_.Exception.Response) {
        Write-Host "Response Status:" -ForegroundColor Yellow
        Write-Host $_.Exception.Response.StatusCode -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Cyan
    Write-Host "1. Verify Context Studio key is valid" -ForegroundColor White
    Write-Host "2. Check API endpoint is correct" -ForegroundColor White
    Write-Host "3. Ensure services are running" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')

# Made with Bob
