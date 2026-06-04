# Final Setup Instructions for Bob (ICA)

## 🎉 Congratulations! Context Studio is configured!

You now have:
- ✅ Schema published in Context Studio
- ✅ Context ID: `ctx_f41f9d5f18a0`
- ✅ MCP Gateway endpoint configured
- ✅ Authentication tokens generated

---

## Step 1: Configure Bob Client

### Option A: Using Bob Settings UI

1. **Open Bob (ICA) Settings**
2. Go to **MCP Servers** or **Integrations** section
3. Click **Add MCP Server**
4. Enter the configuration:

**Server Name:** `context-studio`

**Type:** `streamable-http`

**URL:** 
```
https://servicesessentials.ibm.com/mcp-gateway/service/gateway/servers/8ccdd203bdee4014b08e82eedb6046e2/mcp
```

**Headers:**
- **Authorization:** 
  ```
  Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjb250ZXh0LXN0dWRpby11c2VyQGV4YW1wbGUuY29tIiwianRpIjoiYTk0ODZkNzktNzExOC00Mjg1LWJhMzEtZWRjMmNmMzIzYWMyIiwidG9rZW5fdXNlIjoiYXBpIiwiaWF0IjoxNzgwNTY5NjA2LCJpc3MiOiJtY3BnYXRld2F5IiwiYXVkIjoibWNwZ2F0ZXdheS1hcGkiLCJ1c2VyIjp7ImVtYWlsIjoiY29udGV4dC1zdHVkaW8tdXNlckBleGFtcGxlLmNvbSIsImZ1bGxfbmFtZSI6IkFQSSBUb2tlbiBVc2VyIiwiaXNfYWRtaW4iOmZhbHNlLCJhdXRoX3Byb3ZpZGVyIjoiYXBpX3Rva2VuIn0sInRlYW1zIjpbIjVhYTNiZDhkNDUxMDRlNzVhZDdhMzBjYTAzOTEyYzIwIl0sInNjb3BlcyI6eyJzZXJ2ZXJfaWQiOiI4Y2NkZDIwM2JkZWU0MDE0YjA4ZTgyZWVkYjYwNDZlMiIsInBlcm1pc3Npb25zIjpbImdhdGV3YXlzLnJlYWQiLCJzZXJ2ZXJzLnJlYWQiLCJzZXJ2ZXJzLnVzZSIsInRvb2xzLnJlYWQiLCJ0b29scy5leGVjdXRlIiwidGVhbXMucmVhZCIsInJlc291cmNlcy5yZWFkIiwicHJvbXB0cy5yZWFkIl0sImlwX3Jlc3RyaWN0aW9ucyI6W10sInRpbWVfcmVzdHJpY3Rpb25zIjp7fX0sImV4cCI6MTc4NTU4MDgwNn0.csxEIEL6om0yeQ-liZmdQOXNAd5A1BvMKMlMZUemxcw
  ```

- **x-api-key:** 
  ```
  eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbEFkZHJlc3MiOiJtdWhhbW1lZC5yaXp3YW5AaWJtLmNvbSIsInRlYW1JZCI6IjY3ZTY5NWNhYzM2NTVhMjkxY2QzZjIyYyIsImNvbnRleHRJZCI6ImN0eF9mNDFmOWQ1ZjE4YTAiLCJpYXQiOjE3ODA1Njk2MDUsImV4cCI6MTc4NTc1MzYwNSwiaXNzIjoiY29udGV4dC1icm9rZXIiLCJ0b2tlbl9pZCI6ImY4NjdlNzgzLWU2MDItNDBjOC05YjM5LTIzZDI4YjljOTI1ZCJ9.Dg-GJm5-8pv140lHiS-kIAS3G6i0Y1v-Lft5XzJaeIWtaGXmqdXjiAU2TTEzG0wgwlDYvfdRKCBxen5AHx8V7g
  ```

**Status:** Enabled (not disabled)

5. Click **Save**
6. Click **Connect** or **Start**

### Option B: Using Configuration File

1. **Locate Bob's config directory:**
   - Windows: `%APPDATA%\Bob\` or `C:\Users\YourUsername\.bob\`
   - Look for `mcp-servers.json` or similar

2. **Add or merge** the content from `bob-client-config.json`:
   ```json
   {
     "mcpServers": {
       "context-studio": {
         "type": "streamable-http",
         "url": "https://servicesessentials.ibm.com/mcp-gateway/service/gateway/servers/8ccdd203bdee4014b08e82eedb6046e2/mcp",
         "headers": {
           "Authorization": "Bearer <mcp-gateway-token>",
           "x-api-key": "<context-studio-key>"
         },
         "disabled": false
       }
     }
   }
   ```

3. **Restart Bob** to load the new configuration

---

## Step 2: Verify Connection

### 2.1 Check MCP Server Status

1. In Bob settings, verify:
   - ✅ Server status shows **"Connected"** or **"Running"**
   - ✅ Green indicator next to server name
   - ✅ No error messages in logs

### 2.2 Test Tool Discovery

In Bob chat, ask:
```
"What tools do you have available?"
```

Bob should list tools from Context Studio, such as:
- Query requirements
- List stakeholders
- Get goals
- Find use cases
- Retrieve test cases

---

## Step 3: Ensure Local Services are Running

Before testing GitHub workflow triggers, make sure:

### Terminal 1: Node.js Service
```powershell
cd C:\Users\MuhammedRizwanKP\Desktop\ICA-GITHUB
npm start
```

Should show:
```
🚀 ICA GitHub Trigger Service Started
📡 Server running on port 3000
📦 Repository: rizukp/ICA-GITHUB
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

## Step 4: Test with Bob

### Test 1: Query Context Studio Data

Ask Bob:
```
"Show me the functional requirements for the GitHub workflow trigger system"
```

Expected: Bob retrieves and displays FR-001, FR-002, FR-003

### Test 2: Ask About Stakeholders

Ask Bob:
```
"Who are the stakeholders for this project?"
```

Expected: Bob lists Developer, DevOps Engineer, Development Team, Security Team

### Test 3: Trigger GitHub Workflow

Ask Bob:
```
"Deploy the application to production"
```

Expected: 
- Bob understands the request
- Calls the trigger-workflow API
- Workflow starts on GitHub
- Bob reports success with details

### Test 4: Check Workflow Status

Ask Bob:
```
"Show me the recent workflow runs"
```

Expected: Bob displays recent GitHub Actions runs with status

---

## Step 5: Advanced Testing

### Test Natural Language Understanding

Try these variations:

```
"Run the automated tests"
"Build the app for staging"
"What are the security requirements?"
"Show me test cases for authentication"
"List all goals for this project"
"What use cases do we have?"
```

Bob should understand and respond appropriately using Context Studio data.

---

## 🔧 Troubleshooting

### Issue: "MCP server not connected"

**Solutions:**
1. Verify tokens haven't expired (check expiration dates)
2. Check internet connection
3. Verify URL is correct (no typos)
4. Restart Bob
5. Check Bob logs for detailed error messages

### Issue: "Tools not available"

**Solutions:**
1. Verify Context Studio schema is published
2. Check that context data was uploaded successfully
3. Ensure MCP server status is "Running"
4. Try disconnecting and reconnecting the server

### Issue: "Cannot trigger workflow"

**Solutions:**
1. Verify Node.js service is running (`npm start`)
2. Check ngrok tunnel is active
3. Verify API key in `.env` file
4. Test API directly with PowerShell:
   ```powershell
   .\test-api.ps1
   ```

### Issue: "Bob doesn't understand commands"

**Solutions:**
1. Verify sources were ingested in Context Studio
2. Check that documentation files are marked as "Ingested"
3. Try more specific commands
4. Rephrase using keywords from requirements/use cases

---

## 📊 What Bob Can Do Now

### 1. Query Context Studio Data
- Retrieve requirements, stakeholders, goals, use cases, test cases
- Search and filter based on criteria
- Understand relationships between entities

### 2. Trigger GitHub Workflows
- Deploy to production/staging/development
- Run automated tests
- Build applications
- Execute any workflow defined in repository

### 3. Monitor Workflows
- Check recent workflow runs
- View workflow status and results
- Get links to detailed logs on GitHub

### 4. Provide Context-Aware Responses
- Answer questions about the system
- Explain requirements and their relationships
- Suggest appropriate actions based on context

---

## ✅ Success Criteria

You've successfully set up Bob when:

- ✅ MCP server shows "Connected" status
- ✅ Bob can list available tools
- ✅ Bob can query Context Studio data
- ✅ Bob can trigger GitHub workflows
- ✅ Bob understands natural language commands
- ✅ Workflows execute successfully on GitHub
- ✅ Bob provides accurate, context-aware responses

---

## 🎯 Example Conversation Flow

**You:** "What are the main goals of this project?"

**Bob:** "Based on the context, there are 5 main goals:
1. Automate Deployment Process - Enable automated deployments through natural language
2. Improve Developer Experience - Make workflow triggering intuitive and fast
3. Ensure System Reliability - Maintain 99% uptime
4. Maintain Security Standards - Protect sensitive data
5. Enable Continuous Integration - Support automated testing

Would you like details on any specific goal?"

**You:** "Deploy to production"

**Bob:** "I'll trigger the production deployment workflow...
✅ Workflow triggered successfully!
- Workflow: main.yml
- Environment: production
- Repository: rizukp/ICA-GITHUB
- Timestamp: 2026-06-04T10:45:00Z

You can view the deployment progress at: https://github.com/rizukp/ICA-GITHUB/actions"

---

## 🚀 You're All Set!

Your complete GitHub workflow automation system is now operational:

1. ✅ Repository renamed to ICA-GITHUB
2. ✅ Context Studio schema published
3. ✅ Context data and sources uploaded
4. ✅ MCP server configured
5. ✅ Bob connected and ready
6. ✅ Local services running
7. ✅ Ready to trigger workflows via natural language!

**Start using Bob to automate your GitHub workflows! 🎉**