# Adding Tools to Context Studio via REST API

## 🎯 Overview

Since Context Studio only allows adding tools via REST API, here's how to register your GitHub workflow trigger tool.

---

## Step 1: Get Your Context Studio API Credentials

You already have:
- **Context ID:** `ctx_f41f9d5f18a0`
- **Context Studio Key:** `eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...`
- **MCP Gateway Token:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## Step 2: Register Tool via REST API

### Using PowerShell

Save this as `register-tool.ps1`:

```powershell
# Context Studio API Configuration
$contextId = "ctx_f41f9d5f18a0"
$apiKey = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbEFkZHJlc3MiOiJtdWhhbW1lZC5yaXp3YW5AaWJtLmNvbSIsInRlYW1JZCI6IjY3ZTY5NWNhYzM2NTVhMjkxY2QzZjIyYyIsImNvbnRleHRJZCI6ImN0eF9mNDFmOWQ1ZjE4YTAiLCJpYXQiOjE3ODA1Njk2MDUsImV4cCI6MTc4NTc1MzYwNSwiaXNzIjoiY29udGV4dC1icm9rZXIiLCJ0b2tlbl9pZCI6ImY4NjdlNzgzLWU2MDItNDBjOC05YjM5LTIzZDI4YjljOTI1ZCJ9.Dg-GJm5-8pv140lHiS-kIAS3G6i0Y1v-Lft5XzJaeIWtaGXmqdXjiAU2TTEzG0wgwlDYvfdRKCBxen5AHx8V7g"
$baseUrl = "https://servicesessentials.ibm.com/context-studio/api"

# Your API key from .env file
$workflowApiKey = Read-Host "Enter your API key from .env file"

# Tool configuration
$tool = @{
    context_id = $contextId
    name = "trigger_github_workflow"
    description = "Trigger a GitHub Actions workflow in the ICA-GITHUB repository via the local API service"
    type = "rest_api"
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
                enum = @("build", "test", "deploy", "default task")
            },
            @{
                name = "environment"
                type = "string"
                description = "Target environment"
                required = $false
                default = "production"
                enum = @("development", "staging", "production")
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
                enum = @("true", "false")
            }
        )
    }
} | ConvertTo-Json -Depth 10

# Register the tool
$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/tools" -Method Post -Headers $headers -Body $tool
    Write-Host "✅ Tool registered successfully!" -ForegroundColor Green
    Write-Host "Tool ID: $($response.tool_id)" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Error registering tool:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host $_.Exception.Response -ForegroundColor Red
}
```

### Run the script:
```powershell
.\register-tool.ps1
```

---

## Step 3: Alternative - Using curl (if available)

If you have curl installed:

```bash
curl -X POST https://servicesessentials.ibm.com/context-studio/api/tools \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "context_id": "ctx_f41f9d5f18a0",
    "name": "trigger_github_workflow",
    "description": "Trigger GitHub Actions workflow via local API",
    "type": "rest_api",
    "config": {
      "method": "POST",
      "url": "https://uprising-theme-maturity.ngrok-free.dev/trigger-workflow",
      "headers": {
        "Content-Type": "application/json",
        "x-api-key": "YOUR_API_KEY_HERE"
      },
      "body_template": {
        "workflow_id": "{{workflow_id}}",
        "ref": "{{ref}}",
        "inputs": {
          "task": "{{task}}",
          "environment": "{{environment}}",
          "message": "{{message}}",
          "debug": "{{debug}}"
        }
      },
      "parameters": [
        {
          "name": "workflow_id",
          "type": "string",
          "required": true,
          "default": "main.yml"
        },
        {
          "name": "ref",
          "type": "string",
          "required": true,
          "default": "main"
        },
        {
          "name": "task",
          "type": "string",
          "required": false,
          "default": "deploy"
        },
        {
          "name": "environment",
          "type": "string",
          "required": false,
          "default": "production"
        }
      ]
    }
  }'
```

---

## Step 4: Verify Tool Registration

### Check if tool was registered:

```powershell
# List all tools
$headers = @{
    "Authorization" = "Bearer $apiKey"
}

$response = Invoke-RestMethod -Uri "$baseUrl/contexts/$contextId/tools" -Method Get -Headers $headers
$response | ConvertTo-Json -Depth 10
```

You should see `trigger_github_workflow` in the list.

---

## Step 5: Test the Tool

### Via REST API:

```powershell
# Test tool execution
$toolId = "tool_xxx" # Replace with actual tool ID from registration

$testPayload = @{
    tool_id = $toolId
    parameters = @{
        workflow_id = "main.yml"
        ref = "main"
        task = "deploy"
        environment = "production"
        message = "Test from API"
        debug = "false"
    }
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$baseUrl/tools/execute" -Method Post -Headers $headers -Body $testPayload
$response | ConvertTo-Json -Depth 10
```

---

## Step 6: Register Additional Tools

Repeat the process for other tools:

### Tool 2: List Workflows

```powershell
$tool = @{
    context_id = $contextId
    name = "list_github_workflows"
    description = "List all available GitHub Actions workflows"
    type = "rest_api"
    config = @{
        method = "GET"
        url = "https://uprising-theme-maturity.ngrok-free.dev/workflows"
        headers = @{
            "x-api-key" = $workflowApiKey
        }
        parameters = @()
    }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$baseUrl/tools" -Method Post -Headers $headers -Body $tool
```

### Tool 3: Get Workflow Runs

```powershell
$tool = @{
    context_id = $contextId
    name = "get_workflow_runs"
    description = "Get recent workflow runs"
    type = "rest_api"
    config = @{
        method = "GET"
        url = "https://uprising-theme-maturity.ngrok-free.dev/workflow-runs"
        headers = @{
            "x-api-key" = $workflowApiKey
        }
        parameters = @(
            @{
                name = "workflow_id"
                type = "string"
                required = $false
                default = "main.yml"
            },
            @{
                name = "per_page"
                type = "integer"
                required = $false
                default = 10
            }
        )
        query_parameters = @{
            workflow_id = "{{workflow_id}}"
            per_page = "{{per_page}}"
        }
    }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$baseUrl/tools" -Method Post -Headers $headers -Body $tool
```

---

## 🔧 Troubleshooting

### Issue: "Unauthorized" or 401 error

**Solution:**
1. Verify your Context Studio key is correct
2. Check the key hasn't expired
3. Ensure you're using the correct API endpoint

### Issue: "Invalid tool configuration"

**Solution:**
1. Verify JSON is valid
2. Check all required fields are present
3. Ensure URL is accessible (test with `.\test-api.ps1`)

### Issue: "Tool not appearing in ICA"

**Solution:**
1. Wait a few minutes for sync
2. Restart ICA agent
3. Check tool status via API
4. Verify tool is enabled

---

## 📝 API Endpoints Reference

### Context Studio API Base URL:
```
https://servicesessentials.ibm.com/context-studio/api
```

### Common Endpoints:
- `POST /tools` - Register a new tool
- `GET /contexts/{contextId}/tools` - List tools
- `GET /tools/{toolId}` - Get tool details
- `PUT /tools/{toolId}` - Update tool
- `DELETE /tools/{toolId}` - Delete tool
- `POST /tools/execute` - Execute tool

---

## ✅ Success Criteria

Tool is registered when:
- ✅ API returns 200/201 status
- ✅ Tool ID is returned
- ✅ Tool appears in tools list
- ✅ ICA can discover the tool
- ✅ Tool executes successfully

---

## 🚀 Next Steps

1. **Run `register-tool.ps1`** to register the trigger tool
2. **Verify registration** by listing tools
3. **Test with ICA**: "Deploy to production"
4. **Register additional tools** (list workflows, get runs)
5. **Monitor execution** in Context Studio logs

The tool will now call **your API** instead of trying to trigger GitHub directly!