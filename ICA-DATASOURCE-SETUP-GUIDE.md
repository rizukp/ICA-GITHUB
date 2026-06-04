# ICA GitHub Data Source Setup Guide

## 🔴 Problem: "INSUFFICIENT_DATA to trigger anything"

ICA cannot trigger automations from chat-only requests. It requires a **supported data source** (Git, Jira, SharePoint, or Framer) to emit signals that trigger automations.

## ✅ Solution: Configure GitHub as a Data Source

### Architecture Flow:
```
GitHub Repository (Data Source) → ICA Signal → Automation → Your API → GitHub Actions
```

---

## Step 1: Add GitHub Data Source in Context Studio

### Option A: Via Context Studio UI

1. **Navigate to Context Studio**
   - Go to: https://servicesessentials.ibm.com/context-studio
   - Select your context: `ctx_f41f9d5f18a0`

2. **Add Data Source**
   - Click **"Data Sources"** or **"Integrations"**
   - Click **"Add Data Source"** or **"Connect Repository"**
   - Select **"GitHub"**

3. **Configure GitHub Connection**
   - **Repository**: `rizukp/ICA-GITHUB`
   - **Owner**: `rizukp`
   - **Branch**: `main`
   - **Authentication**: Personal Access Token
   - **Token**: (Your GitHub PAT from `.env`)
   - **Scopes Required**: `repo`, `workflow`

4. **Enable Webhooks** (Optional but recommended)
   - Webhook URL: `https://uprising-theme-maturity.ngrok-free.dev/webhook`
   - Events: `push`, `pull_request`, `workflow_run`, `workflow_dispatch`

5. **Save Configuration**

### Option B: Import Configuration File

1. In Context Studio, look for **"Import Data Source"** or **"Upload Configuration"**
2. Upload: `ica-github-datasource.json`
3. Review and confirm the settings
4. Save

---

## Step 2: Create Automation Rules

### Automation 1: Trigger Workflow

**Name**: Trigger GitHub Workflow

**Trigger**:
- **Type**: Git Signal
- **Source**: GitHub (rizukp/ICA-GITHUB)
- **Event**: Custom signal `workflow_dispatch_request`

**Conditions**:
- `workflow_id` equals `main.yml`

**Actions**:
- **Type**: HTTP Request
- **Method**: POST
- **URL**: `https://uprising-theme-maturity.ngrok-free.dev/trigger-workflow`
- **Headers**:
  ```json
  {
    "Content-Type": "application/json",
    "x-api-key":"82679a134903d35084f7c35e25a4b4c331a2533cacc57a6b563f373a2d28e139"
  }
  ```
- **Body**:
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

### Automation 2: Get Workflow Runs

**Name**: Get Workflow Runs

**Trigger**:
- **Type**: Git Signal
- **Source**: GitHub (rizukp/ICA-GITHUB)
- **Event**: Custom signal `workflow_runs_request`

**Actions**:
- **Type**: HTTP Request
- **Method**: GET
- **URL**: `https://uprising-theme-maturity.ngrok-free.dev/workflow-runs?workflow_id=${workflow_id}&per_page=${per_page}`
- **Headers**:
  ```json
  {
    "x-api-key":"82679a134903d35084f7c35e25a4b4c331a2533cacc57a6b563f373a2d28e139"
  }
  ```

---

## Step 3: Define Custom Signals

In Context Studio, create custom signals that ICA can emit:

### Signal 1: workflow_dispatch_request

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "workflow_id": {
      "type": "string",
      "default": "main.yml"
    },
    "ref": {
      "type": "string",
      "default": "main"
    },
    "task": {
      "type": "string",
      "enum": ["build", "test", "deploy"]
    },
    "environment": {
      "type": "string",
      "enum": ["development", "staging", "production"]
    },
    "message": {
      "type": "string"
    },
    "debug": {
      "type": "string",
      "enum": ["true", "false"]
    }
  },
  "required": ["workflow_id", "ref"]
}
```

### Signal 2: workflow_runs_request

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "workflow_id": {
      "type": "string",
      "default": "main.yml"
    },
    "per_page": {
      "type": "integer",
      "default": 10
    }
  }
}
```

---

## Step 4: Configure Agent Instructions

Add these instructions to your ICA agent in Context Studio:

```
When the user asks to trigger a GitHub workflow, deploy, build, or test:

1. Emit a "workflow_dispatch_request" signal to the GitHub data source
2. Include the appropriate parameters:
   - For "deploy to production": task="deploy", environment="production"
   - For "run tests": task="test", environment="development"
   - For "build for staging": task="build", environment="staging"
3. The automation will trigger the workflow via the API
4. Report the result to the user

When the user asks about workflow status or recent runs:
1. Emit a "workflow_runs_request" signal
2. Include workflow_id and per_page parameters
3. Display the results in a readable format
```

---

## Step 5: Add Webhook Endpoint (Optional)

If you want GitHub to push events to your service, add this to `server.js`:

```javascript
// Webhook endpoint for GitHub events
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  try {
    const event = req.headers['x-github-event'];
    const payload = JSON.parse(req.body);
    
    console.log(`Received GitHub webhook: ${event}`);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    
    // Process the webhook event
    // You can forward this to ICA or handle it locally
    
    res.status(200).json({ received: true, event: event });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

---

## Step 6: Test the Integration

### Test 1: Verify Data Source Connection

In ICA, ask:
```
"Is the GitHub repository connected?"
```

ICA should confirm the data source is active.

### Test 2: Emit Signal to Trigger Workflow

In ICA, ask:
```
"Deploy to production"
```

ICA should:
1. Emit `workflow_dispatch_request` signal
2. Automation triggers your API
3. API triggers GitHub Actions
4. ICA reports success

### Test 3: Get Workflow Runs

In ICA, ask:
```
"Show me the recent workflow runs for main.yml"
```

ICA should:
1. Emit `workflow_runs_request` signal
2. Automation calls your API
3. API fetches runs from GitHub
4. ICA displays the results

---

## 🔧 Troubleshooting

### Issue: "INSUFFICIENT_DATA to trigger anything"

**Cause**: No data source configured or signal not properly defined

**Solution**:
1. Verify GitHub data source is added in Context Studio
2. Check that custom signals are defined
3. Ensure automations are enabled and active
4. Verify the signal names match exactly

### Issue: "Cannot emit signal"

**Cause**: Signal schema validation failed

**Solution**:
1. Check signal schema matches the data you're sending
2. Ensure required fields are included
3. Verify data types match (string, integer, etc.)

### Issue: Automation doesn't trigger

**Cause**: Automation conditions not met or disabled

**Solution**:
1. Check automation is enabled in Context Studio
2. Verify trigger conditions match the signal
3. Check automation logs for errors
4. Test the HTTP endpoint directly first

### Issue: API returns 401 Unauthorized

**Cause**: API_KEY not configured or incorrect

**Solution**:
1. Add API_KEY as environment variable in Context Studio
2. Verify it matches the key in your `.env` file
3. Check the header name is exactly `x-api-key`

---

## 📋 Verification Checklist

Before testing with ICA, ensure:

- ✅ GitHub data source added in Context Studio
- ✅ Repository: `rizukp/ICA-GITHUB` configured
- ✅ GitHub PAT with `repo` and `workflow` scopes
- ✅ Custom signals defined: `workflow_dispatch_request`, `workflow_runs_request`
- ✅ Automations created and enabled
- ✅ API_KEY environment variable set in Context Studio
- ✅ Node.js service running (`npm start`)
- ✅ ngrok tunnel active
- ✅ Agent instructions configured
- ✅ Webhook endpoint added (optional)

---

## 🎯 Expected Behavior After Setup

### Before (Current - BROKEN):
```
User: "Deploy to production"
ICA: ❌ INSUFFICIENT_DATA to trigger anything
```

### After (Fixed):
```
User: "Deploy to production"
ICA: ✅ Emitting workflow_dispatch_request signal...
     ✅ Automation triggered successfully!
     ✅ Workflow main.yml started on rizukp/ICA-GITHUB
     ✅ Environment: production
     ✅ View at: https://github.com/rizukp/ICA-GITHUB/actions
```

---

## 🚀 Alternative: Use MCP Server (Advanced)

If Context Studio doesn't support custom Git signals, you can use the MCP (Model Context Protocol) server approach:

1. The `mcp-server.js` file is already in your project
2. Configure it in `.bob/mcp.json` (already done)
3. ICA can call MCP tools directly without needing data source signals

See `ICA-TOOL-SETUP.md` for MCP-based approach.

---

## 📚 Key Concepts

**Data Source**: External system (GitHub) that ICA monitors for events

**Signal**: Event emitted from a data source that triggers automations

**Automation**: Rule that executes actions when a signal is received

**Action**: HTTP request, notification, or other operation performed by automation

**The Flow**:
```
User Request → ICA → Emit Signal → Data Source → Automation → HTTP Action → Your API → GitHub
```

---

## 📝 Summary

The key difference from the previous approach:

**Old (Doesn't Work)**:
- ICA tries to call tools directly from chat
- No data source = "INSUFFICIENT_DATA" error

**New (Works)**:
- GitHub configured as data source
- ICA emits signals to the data source
- Signals trigger automations
- Automations call your API
- API triggers GitHub Actions

This satisfies ICA's requirement for a supported source type (Git) while still using your custom API service!