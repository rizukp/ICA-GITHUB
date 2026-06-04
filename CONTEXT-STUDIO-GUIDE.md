# Complete Context Studio Integration Guide

This guide walks you through setting up ICA Context Studio to trigger GitHub Actions workflows.

## 📋 Overview

You'll complete these steps:
1. Create and upload API schema to Context Studio
2. Ingest data sources (documentation)
3. Create MCP server configuration
4. Test the agent with workflow triggers

---

## Step 1: Prepare Your Environment

### 1.1 Ensure Services are Running

Open **3 terminals**:

**Terminal 1 - Node.js Service:**
```powershell
cd C:\Users\MuhammedRizwanKP\Desktop\ICA-GITHUB
npm start
```

**Terminal 2 - ngrok Tunnel:**
```powershell
ngrok http 3000
```

**Terminal 3 - Testing:**
Keep this open for testing commands.

### 1.2 Get Your Credentials

1. **ngrok URL**: Copy from Terminal 2 (e.g., `https://abc123.ngrok-free.app`)
2. **API Key**: Open `.env` file and copy the `API_KEY` value

---

## Step 2: Create Schema in Context Studio

### 2.1 Open Context Studio in ICA

1. Launch ICA application
2. Click on **Context Studio** in the sidebar
3. Click **New Schema** or **Import Schema**

### 2.2 Upload the Schema

**IMPORTANT: Use the JSON-LD format file**

Context Studio requires JSON-LD format with `@context`, `@id`, `@type`, and `name` fields.

**Option A: Import from File (Recommended)**
1. Click **Import Schema** or **Upload Schema**
2. Select `context-studio-schema-jsonld.json` from your project directory
3. Click **Upload**
4. Wait for validation to complete

**Option B: Create Manually**
1. Click **New Schema**
2. Name it: `GitHub Workflow Trigger API`
3. Copy the contents of `context-studio-schema-jsonld.json`
4. Paste into the schema editor
5. Click **Validate** to check for errors
6. Click **Save**

**Note:** The file `context-studio-schema-jsonld.json` includes:
- JSON-LD context (`@context`)
- Unique identifier (`@id`)
- Schema type (`@type`)
- Application name (`name`)
- OpenAPI specification embedded within

### 2.3 After Upload - No "Publish" Button?

**This is normal!** Context Studio doesn't always show a "Publish" button. Instead:

1. **Verify the schema is saved:**
   - You should see it in your schemas list
   - Status should show "Active" or "Ready"

2. **The schema is already usable** - no publish needed

3. **Next step:** Configure authentication and create data sources

### 2.4 Configure Authentication

**Important:** Set up API key authentication for the schema:

1. In Context Studio, find your uploaded schema
2. Click on the schema name to open settings
3. Look for **Authentication** or **Security** section
4. Configure:
   - **Type**: API Key
   - **Header Name**: `x-api-key`
   - **API Key Value**: Paste your API key from `.env` file
   - **Location**: Header
5. Click **Save** or **Apply**

**Alternative locations for authentication:**
- Some versions: **Schema Settings** → **Authentication**
- Some versions: **API Configuration** → **Security**
- Some versions: Right-click schema → **Configure** → **Authentication**

---

## Step 3: Ingest Data Sources

### 3.1 Create Documentation Source

1. In Context Studio, go to **Data Sources** tab
2. Click **Add Source**
3. Select **File Upload**

### 3.2 Upload Documentation Files

Upload these files from your project:

**File 1: README.md**
- Click **Upload File**
- Select `README.md`
- Set **Source Type**: Documentation
- Set **Priority**: High
- Click **Ingest**

**File 2: SETUP-GUIDE.md**
- Click **Upload File**
- Select `SETUP-GUIDE.md`
- Set **Source Type**: Documentation
- Set **Priority**: High
- Click **Ingest**

**File 3: API Schema**
- Click **Upload File**
- Select `context-studio-schema.json`
- Set **Source Type**: API Reference
- Set **Priority**: High
- Click **Ingest**

### 3.3 Wait for Ingestion

- Context Studio will process the files
- Wait for status to show **"Ingested"** (usually 1-2 minutes)
- You'll see a green checkmark when complete

---

## Step 4: Create MCP Server Configuration

### 4.1 Install MCP SDK

In your project directory:

```powershell
npm install @modelcontextprotocol/sdk node-fetch
```

### 4.2 Create MCP Server File

The file `mcp-server.js` is already in your SETUP-GUIDE.md. Let me create it as a separate file:

1. Create `mcp-server.js` in your project root
2. Copy the MCP server code from SETUP-GUIDE.md
3. Save the file

### 4.3 Configure MCP in Context Studio

1. In Context Studio, go to **MCP Servers** tab
2. Click **Add MCP Server**
3. Fill in the configuration:

```json
{
  "name": "github-workflow-trigger",
  "command": "node",
  "args": ["C:/Users/MuhammedRizwanKP/Desktop/ICA-GITHUB/mcp-server.js"],
  "env": {
    "API_BASE_URL": "http://localhost:3000",
    "API_KEY": "your_api_key_here"
  }
}
```

4. Replace `your_api_key_here` with your actual API key
5. Click **Save**
6. Click **Start Server**

### 4.4 Verify MCP Server Status

- Check that status shows **"Running"** (green indicator)
- If it shows error, check the logs in Context Studio
- Common issues:
  - Node.js not in PATH
  - Wrong file path
  - Missing dependencies (run `npm install` again)

---

## Step 5: Create Agent Actions

### 5.1 Create "Deploy to Production" Action

1. In Context Studio, go to **Actions** tab
2. Click **New Action**
3. Configure:

**Action Name**: `Deploy to Production`

**Description**: `Deploy the application to production environment`

**Endpoint**: `/trigger-workflow`

**Method**: `POST`

**Request Body**:
```json
{
  "workflow_id": "main.yml",
  "ref": "main",
  "inputs": {
    "task": "deploy",
    "environment": "production",
    "message": "Production deployment triggered by ICA",
    "debug": "false"
  }
}
```

4. Click **Save**

### 5.2 Create "Run Tests" Action

1. Click **New Action**
2. Configure:

**Action Name**: `Run Tests`

**Description**: `Run automated tests in development environment`

**Endpoint**: `/trigger-workflow`

**Method**: `POST`

**Request Body**:
```json
{
  "workflow_id": "main.yml",
  "ref": "main",
  "inputs": {
    "task": "test",
    "environment": "development",
    "message": "Running tests from ICA",
    "debug": "true"
  }
}
```

3. Click **Save**

### 5.3 Create "Build Application" Action

1. Click **New Action**
2. Configure:

**Action Name**: `Build Application`

**Description**: `Build the application for staging`

**Endpoint**: `/trigger-workflow`

**Method**: `POST`

**Request Body**:
```json
{
  "workflow_id": "main.yml",
  "ref": "main",
  "inputs": {
    "task": "build",
    "environment": "staging",
    "message": "Building application from ICA",
    "debug": "false"
  }
}
```

3. Click **Save**

### 5.4 Create "Check Workflow Status" Action

1. Click **New Action**
2. Configure:

**Action Name**: `Check Workflow Status`

**Description**: `Get recent workflow runs`

**Endpoint**: `/workflow-runs`

**Method**: `GET`

**Query Parameters**:
- `workflow_id`: `main.yml`
- `per_page`: `5`

3. Click **Save**

---

## Step 6: Test the Agent

### 6.1 Test with Direct Action

1. In Context Studio, go to **Actions** tab
2. Click on **"Deploy to Production"**
3. Click **Test Action**
4. Review the response
5. Expected response:
```json
{
  "success": true,
  "message": "Workflow triggered successfully",
  "workflow": "main.yml",
  "repository": "rizukp/ICA-GITHUB"
}
```

### 6.2 Test with Natural Language

1. Open ICA chat interface
2. Try these commands:

**Command 1: Deploy**
```
Deploy the application to production
```

**Command 2: Run Tests**
```
Run the automated tests
```

**Command 3: Check Status**
```
Show me the recent workflow runs
```

**Command 4: Build**
```
Build the application for staging environment
```

### 6.3 Verify on GitHub

1. Go to: https://github.com/rizukp/ICA-GITHUB/actions
2. You should see new workflow runs
3. Click on a run to see details
4. Verify the inputs match what you sent

---

## Step 7: Advanced Agent Configuration

### 7.1 Create Smart Agent Prompts

In Context Studio, create custom prompts:

**Prompt 1: Deployment Assistant**
```
You are a deployment assistant. When the user asks to deploy:
1. Confirm the target environment (production/staging/development)
2. Ask for a deployment message
3. Use the "Deploy to Production" action with the provided details
4. After deployment, check the status using "Check Workflow Status"
5. Report the results to the user
```

**Prompt 2: Testing Assistant**
```
You are a testing assistant. When the user asks to run tests:
1. Use the "Run Tests" action
2. Wait for completion
3. Check the workflow status
4. Report test results and any failures
```

### 7.2 Configure Agent Behavior

1. Go to **Agent Settings** in Context Studio
2. Enable these features:
   - ✅ **Auto-confirm actions** (for trusted operations)
   - ✅ **Show action results** (display API responses)
   - ✅ **Use MCP tools** (enable MCP server integration)
   - ✅ **Context awareness** (use ingested documentation)

3. Set **Response Style**: Technical and detailed
4. Click **Save**

---

## Step 8: Monitoring and Debugging

### 8.1 View Action Logs

1. In Context Studio, go to **Logs** tab
2. Filter by:
   - Action name
   - Status (success/error)
   - Time range

### 8.2 Monitor ngrok Traffic

1. Open browser: http://localhost:4040
2. View all HTTP requests
3. Check request/response details
4. Useful for debugging API issues

### 8.3 Check Node.js Service Logs

In Terminal 1 (where Node.js is running):
- Watch for incoming requests
- Check for errors
- Verify API key authentication

### 8.4 Check GitHub Actions

1. Go to: https://github.com/rizukp/ICA-GITHUB/actions
2. View workflow runs
3. Check execution logs
4. Verify inputs were received correctly

---

## 🎯 Testing Checklist

Use this checklist to verify everything works:

- [ ] Node.js service is running on port 3000
- [ ] ngrok tunnel is active and showing public URL
- [ ] Schema uploaded to Context Studio
- [ ] Server URL updated with ngrok URL
- [ ] API key configured in authentication
- [ ] Documentation files ingested successfully
- [ ] MCP server created and running
- [ ] All 4 actions created (Deploy, Test, Build, Status)
- [ ] Direct action test successful
- [ ] Natural language command works
- [ ] Workflow appears on GitHub Actions
- [ ] Workflow executes with correct inputs

---

## 🔧 Troubleshooting

### Issue: "Connection refused"
**Solution:**
1. Check Node.js service is running
2. Verify ngrok is active
3. Update schema with current ngrok URL
4. Restart Context Studio

### Issue: "Unauthorized"
**Solution:**
1. Check API key in `.env` matches Context Studio
2. Verify `x-api-key` header is configured
3. Re-save authentication settings

### Issue: "Workflow not found"
**Solution:**
1. Verify `main.yml` exists in `.github/workflows/`
2. Check repository name is correct
3. Ensure workflow has `workflow_dispatch` trigger

### Issue: MCP Server won't start
**Solution:**
1. Run `npm install` to ensure dependencies
2. Check file path is correct (use full path)
3. Verify Node.js is in system PATH
4. Check MCP server logs in Context Studio

### Issue: Agent doesn't understand commands
**Solution:**
1. Verify documentation is ingested
2. Check agent prompts are configured
3. Use more specific commands
4. Enable "Context awareness" in settings

---

## 📝 Example Conversation Flow

Here's how a typical interaction should work:

**You:** "Deploy the latest changes to production"

**ICA:** "I'll deploy to production. Let me trigger the workflow..."
*[Calls Deploy to Production action]*

**ICA:** "✅ Deployment triggered successfully! 
- Workflow: main.yml
- Environment: production
- Repository: rizukp/ICA-GITHUB
- Timestamp: 2026-06-04T10:15:00Z

Would you like me to check the deployment status?"

**You:** "Yes, check the status"

**ICA:** *[Calls Check Workflow Status action]*

**ICA:** "Here are the recent workflow runs:
1. ✅ Production deployment - Completed successfully (2 minutes ago)
2. ✅ Running tests - Completed successfully (15 minutes ago)
3. ✅ Staging build - Completed successfully (1 hour ago)

The latest deployment is running. You can view details at:
https://github.com/rizukp/ICA-GITHUB/actions"

---

## 🎓 Next Steps

Once everything is working:

1. **Customize workflows**: Edit `.github/workflows/main.yml` for your needs
2. **Add more actions**: Create actions for other tasks
3. **Set up notifications**: Configure Slack/Discord webhooks
4. **Automate deployments**: Schedule regular deployments
5. **Add monitoring**: Integrate with monitoring tools

---

## 📚 Additional Resources

- Context Studio Documentation: Check ICA help docs
- GitHub Actions: https://docs.github.com/en/actions
- OpenAPI Specification: https://swagger.io/specification/
- MCP Protocol: https://modelcontextprotocol.io/

---

## ✅ Success Criteria

You've successfully set up Context Studio when:

✅ You can trigger workflows using natural language
✅ Actions execute without errors
✅ Workflows appear on GitHub with correct inputs
✅ Agent understands context from documentation
✅ MCP server provides tool discovery
✅ All monitoring tools show successful requests

**Congratulations! Your ICA Context Studio integration is complete! 🎉**