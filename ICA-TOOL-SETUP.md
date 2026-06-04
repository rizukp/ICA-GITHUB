# Fixing ICA Agent Tool Configuration

## 🔴 Problem Identified

The ICA agent is trying to trigger GitHub Actions directly, but it's blocked because:
- Event emitter only accepts: `sharepoint`, `jira`, `git`, `framer`
- User context is not an accepted source type
- ICA cannot trigger GitHub Actions directly

## ✅ Solution

Configure ICA to use your **local API service** (via ngrok) instead of trying to trigger GitHub directly.

---

## Step 1: Understand the Architecture

```
ICA Agent → Your API (ngrok) → GitHub API → GitHub Actions
```

**NOT:**
```
ICA Agent → GitHub Actions (BLOCKED ❌)
```

---

## Step 2: Configure Custom Tools in ICA

### Option A: Using Context Studio Tools

1. **Go to Context Studio**
2. Navigate to your context: `ctx_f41f9d5f18a0`
3. Go to **"Tools"** or **"Actions"** section
4. Click **"Add Custom Tool"** or **"Create Action"**

### Option B: Import Tool Configuration

1. In Context Studio, look for **"Import Tools"** or **"Upload Configuration"**
2. Upload the file: `ica-tool-config.json`
3. This will create 4 tools:
   - `trigger_github_workflow`
   - `list_github_workflows`
   - `get_workflow_runs`
   - `check_service_health`

---

## Step 3: Create Tools Manually (if import not available)

### Tool 1: Trigger GitHub Workflow

**Name:** `trigger_github_workflow`

**Description:** Trigger a GitHub Actions workflow via the local API service

**Type:** HTTP Request

**Method:** POST

**URL:** `https://uprising-theme-maturity.ngrok-free.dev/trigger-workflow`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "x-api-key": "${API_KEY}"
}
```

**Body Template:**
```json
{
  "workflow_id": "${workflow_id}",
  "ref": "${ref}",
  "inputs": {
    "task": "${task}",
    "environment": "${environment}",
    "message": "${message}",
    "debug": "${debug}"
  }
}
```

**Parameters:**
- `workflow_id` (string, required, default: "main.yml")
- `ref` (string, required, default: "main")
- `task` (string, optional, default: "deploy")
- `environment` (string, optional, default: "production")
- `message` (string, optional, default: "Triggered by ICA")
- `debug` (string, optional, default: "false")

**Save the tool**

### Tool 2: List Workflows

**Name:** `list_github_workflows`

**Type:** HTTP Request

**Method:** GET

**URL:** `https://uprising-theme-maturity.ngrok-free.dev/workflows`

**Headers:**
```json
{
  "x-api-key": "${API_KEY}"
}
```

**Save the tool**

### Tool 3: Get Workflow Runs

**Name:** `get_workflow_runs`

**Type:** HTTP Request

**Method:** GET

**URL:** `https://uprising-theme-maturity.ngrok-free.dev/workflow-runs?workflow_id=${workflow_id}&per_page=${per_page}`

**Headers:**
```json
{
  "x-api-key": "${API_KEY}"
}
```

**Parameters:**
- `workflow_id` (string, optional, default: "main.yml")
- `per_page` (integer, optional, default: 10)

**Save the tool**

---

## Step 4: Configure Environment Variables

In Context Studio or ICA settings:

1. Go to **Environment Variables** or **Secrets**
2. Add variable:
   - **Name:** `API_KEY`
   - **Value:** (your API key from `.env` file)
   - **Type:** Secret
3. Save

---

## Step 5: Test the Tools

### Test 1: Check Service Health

In ICA, ask:
```
"Check if the workflow service is running"
```

ICA should call `check_service_health` tool and return service status.

### Test 2: List Workflows

Ask ICA:
```
"What workflows are available?"
```

ICA should call `list_github_workflows` and show available workflows.

### Test 3: Trigger Workflow

Ask ICA:
```
"Deploy to production"
```

ICA should:
1. Call `trigger_github_workflow` tool
2. Send POST request to your API
3. Your API triggers GitHub Actions
4. Return success confirmation

---

## Step 6: Verify Services are Running

Before testing, ensure:

### Terminal 1: Node.js Service
```powershell
cd C:\Users\MuhammedRizwanKP\Desktop\ICA-GITHUB
npm start
```

Should show:
```
🚀 ICA GitHub Trigger Service Started
📡 Server running on port 3000
```

### Terminal 2: ngrok Tunnel
```powershell
ngrok http 3000
```

Should show:
```
Forwarding: https://uprising-theme-maturity.ngrok-free.dev -> http://localhost:3000
```

---

## Step 7: Update Agent Instructions (Optional)

In ICA/Context Studio, add agent instructions:

```
When the user asks to trigger a GitHub workflow, deploy, or run tests:
1. Use the trigger_github_workflow tool
2. Set appropriate parameters based on the request
3. For "deploy to production": environment="production", task="deploy"
4. For "run tests": environment="development", task="test"
5. For "build for staging": environment="staging", task="build"
6. Always include a descriptive message
7. Report the result to the user with workflow details
```

---

## 🎯 Expected Behavior After Fix

### Before (Current - BROKEN):
```
User: "Deploy to production"
ICA: ❌ Cannot trigger - unsupported source_type
```

### After (Fixed):
```
User: "Deploy to production"
ICA: ✅ Calling trigger_github_workflow tool...
     ✅ Workflow triggered successfully!
     - Workflow: main.yml
     - Environment: production
     - Repository: rizukp/ICA-GITHUB
     - View at: https://github.com/rizukp/ICA-GITHUB/actions
```

---

## 🔧 Troubleshooting

### Issue: "Tool not found"

**Solution:**
1. Verify tools are created in Context Studio
2. Check tool names match exactly
3. Ensure tools are enabled
4. Restart ICA agent

### Issue: "API key invalid"

**Solution:**
1. Check `API_KEY` environment variable is set
2. Verify it matches the key in your `.env` file
3. Ensure no extra spaces or quotes
4. Re-save the environment variable

### Issue: "Connection refused"

**Solution:**
1. Verify Node.js service is running (`npm start`)
2. Check ngrok tunnel is active
3. Verify ngrok URL in tool configuration matches current URL
4. Test API directly: `.\test-api.ps1`

### Issue: "ICA still tries to trigger GitHub directly"

**Solution:**
1. Clear ICA's cache/memory
2. Restart ICA agent
3. Be more explicit: "Use the trigger_github_workflow tool to deploy"
4. Check agent instructions are configured

---

## 📝 Quick Reference

### Tool Names:
- `trigger_github_workflow` - Trigger a workflow
- `list_github_workflows` - List available workflows
- `get_workflow_runs` - Get recent runs
- `check_service_health` - Check service status

### API Endpoints:
- POST `/trigger-workflow` - Trigger workflow
- GET `/workflows` - List workflows
- GET `/workflow-runs` - Get runs
- GET `/health` - Health check

### ngrok URL:
```
https://uprising-theme-maturity.ngrok-free.dev
```

### API Key Location:
```
.env file → API_KEY variable
```

---

## ✅ Success Criteria

Tools are working when:
- ✅ ICA can call trigger_github_workflow tool
- ✅ Workflow triggers on GitHub
- ✅ ICA reports success with details
- ✅ No "unsupported source_type" errors
- ✅ Natural language commands work

---

## 🚀 Next Steps

1. **Create tools in Context Studio** using the configurations above
2. **Set API_KEY environment variable**
3. **Ensure services are running** (Node.js + ngrok)
4. **Test with ICA**: "Deploy to production"
5. **Verify on GitHub**: Check Actions tab for new run

The key is making ICA use **your API** instead of trying to trigger GitHub directly!