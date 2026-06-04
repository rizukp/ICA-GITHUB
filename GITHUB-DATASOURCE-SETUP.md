# Adding GitHub as Data Source in Context Studio

## 🎯 Overview

Adding GitHub as a data source allows Context Studio to:
- Access your repository code and files
- Read workflow definitions
- Monitor workflow runs
- Understand your codebase structure
- Provide better context-aware responses

---

## Step 1: Navigate to Data Sources

1. In Context Studio, open your context: `ctx_f41f9d5f18a0`
2. Look for **"Data Sources"** tab or section
3. Click **"Connect to enterprise data sources"** or **"Add Data Source"**

---

## Step 2: Select GitHub as Data Source

1. Look for **GitHub** in the list of available connectors
2. Click on **GitHub** or **GitHub Enterprise**
3. Click **"Connect"** or **"Add Connection"**

---

## Step 3: Authenticate with GitHub

### Option A: OAuth Authentication (Recommended)

1. Click **"Authenticate with GitHub"**
2. You'll be redirected to GitHub
3. **Sign in** to your GitHub account
4. **Authorize** Context Studio to access your repositories
5. Select the permissions:
   - ✅ Read access to code
   - ✅ Read access to metadata
   - ✅ Read access to workflows
   - ✅ Read access to actions

### Option B: Personal Access Token

If OAuth isn't available, use your GitHub token:

1. Select **"Use Personal Access Token"**
2. Enter your GitHub token from `.env` file:
   ```
   Token: (your GITHUB_TOKEN value)
   ```
3. Click **"Validate"** to test the connection

---

## Step 4: Configure Repository Access

### 4.1 Select Repository

1. **Repository Owner:** `rizukp`
2. **Repository Name:** `ICA-GITHUB`
3. **Full Repository URL:** `https://github.com/rizukp/ICA-GITHUB`

### 4.2 Configure Access Scope

Select what to sync:
- ✅ **Code files** - All source code
- ✅ **README and documentation** - Markdown files
- ✅ **Workflow files** - `.github/workflows/*.yml`
- ✅ **Issues** (optional) - For tracking
- ✅ **Pull Requests** (optional) - For code review context
- ✅ **Actions/Workflows** - Workflow definitions and runs

### 4.3 Set Sync Frequency

Choose how often to sync:
- **Real-time** (if available) - Best for active development
- **Hourly** - Good balance
- **Daily** - For stable repositories
- **Manual** - Sync on demand

**Recommended:** Hourly or Real-time

---

## Step 5: Configure Indexing

### 5.1 File Patterns to Include

Specify which files to index:

```
**/*.md
**/*.js
**/*.json
**/*.yml
**/*.yaml
.github/workflows/*
README.md
package.json
server.js
```

### 5.2 File Patterns to Exclude

Exclude unnecessary files:

```
node_modules/**
.git/**
*.log
.env
.env.*
package-lock.json
```

### 5.3 Indexing Options

- ✅ **Index code content** - Full file content
- ✅ **Extract metadata** - File info, authors, dates
- ✅ **Parse structure** - Functions, classes, exports
- ✅ **Track changes** - Git history (optional)

---

## Step 6: Test the Connection

1. Click **"Test Connection"**
2. Verify it shows:
   - ✅ Connection successful
   - ✅ Repository accessible
   - ✅ Can read files
   - ✅ Can access workflows

3. Click **"Save"** or **"Connect"**

---

## Step 7: Initial Sync

1. Click **"Start Sync"** or **"Sync Now"**
2. Wait for initial indexing (may take 2-5 minutes)
3. Monitor progress:
   - Files discovered
   - Files indexed
   - Workflows found

4. Wait for status: **"Synced"** or **"Ready"**

---

## Step 8: Verify GitHub Data

### 8.1 Check Indexed Files

1. Go to **"Data Sources"** → **"GitHub"**
2. Click **"View Indexed Content"**
3. Verify you see:
   - ✅ README.md
   - ✅ server.js
   - ✅ package.json
   - ✅ .github/workflows/main.yml
   - ✅ Other project files

### 8.2 Test Search

Try searching for:
- "workflow trigger"
- "GitHub Actions"
- "API endpoint"

Verify results include content from your repository.

---

## Step 9: Configure Workflow Access

### 9.1 Enable Workflow Monitoring

If available, enable:
- ✅ **Monitor workflow runs** - Track executions
- ✅ **Read workflow logs** - Access run details
- ✅ **Workflow status** - Current state

### 9.2 Set Permissions

Ensure Context Studio can:
- ✅ Read workflow definitions
- ✅ View workflow runs
- ✅ Access run logs
- ❌ Trigger workflows (handled by your API)

---

## Step 10: Test with Bob

Once GitHub is connected, test with Bob:

### Test 1: Ask About Code
```
"What files are in the repository?"
"Show me the main workflow file"
"What does server.js do?"
```

### Test 2: Ask About Workflows
```
"What workflows are defined in the repository?"
"Show me the workflow configuration"
"What inputs does the main workflow accept?"
```

### Test 3: Combined Queries
```
"Based on the repository code, what are the API endpoints?"
"How is authentication implemented in the code?"
"What environment variables are needed?"
```

Bob should now have access to your actual repository content!

---

## 🎯 Benefits of GitHub Data Source

### 1. Code-Aware Responses
Bob can:
- Reference actual code when answering questions
- Suggest changes based on current implementation
- Understand your codebase structure

### 2. Workflow Intelligence
Bob can:
- Know which workflows exist
- Understand workflow inputs and outputs
- Suggest appropriate workflows for tasks

### 3. Documentation Context
Bob can:
- Reference your README and docs
- Provide accurate setup instructions
- Answer questions about the project

### 4. Real-Time Updates
Bob stays current with:
- Latest code changes
- New workflows added
- Updated documentation

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to GitHub"

**Solutions:**
1. Verify GitHub token has correct permissions:
   - `repo` scope
   - `workflow` scope
   - `read:org` (if organization repo)
2. Check token hasn't expired
3. Verify repository URL is correct
4. Try re-authenticating

### Issue: "Repository not found"

**Solutions:**
1. Check repository name spelling: `ICA-GITHUB`
2. Verify owner name: `rizukp`
3. Ensure repository is not private (or token has private repo access)
4. Check repository exists at: https://github.com/rizukp/ICA-GITHUB

### Issue: "Sync failed"

**Solutions:**
1. Check internet connection
2. Verify GitHub API rate limits not exceeded
3. Check file patterns are valid
4. Try manual sync
5. Review error logs in Context Studio

### Issue: "Files not indexed"

**Solutions:**
1. Check file patterns include the files you want
2. Verify files aren't in exclude patterns
3. Check file size limits (usually < 1MB per file)
4. Wait for sync to complete fully
5. Try re-syncing

---

## 📊 What Gets Indexed

### From Your Repository:

**Code Files:**
- `server.js` - Main API server
- `mcp-server.js` - MCP server implementation
- `test-api.ps1` - Testing scripts

**Configuration:**
- `package.json` - Dependencies and scripts
- `.env.example` - Environment variables template
- `.gitignore` - Git ignore patterns

**Workflows:**
- `.github/workflows/main.yml` - Main workflow definition

**Documentation:**
- `README.md` - Project overview
- `SETUP-GUIDE.md` - Setup instructions
- `CONTEXT-STUDIO-GUIDE.md` - Integration guide
- All other .md files

**Data Files:**
- `context-data-*.json` - Context data
- `bob-client-config.json` - Bob configuration

---

## ✅ Success Criteria

GitHub data source is working when:

- ✅ Connection status shows "Connected"
- ✅ Sync status shows "Synced" or "Up to date"
- ✅ Files are visible in indexed content
- ✅ Search returns results from repository
- ✅ Bob can answer questions about your code
- ✅ Bob knows about your workflows
- ✅ Bob references actual file content

---

## 🚀 Advanced Configuration

### Webhook Integration (if available)

Set up webhooks for real-time updates:

1. In GitHub repository settings
2. Add webhook URL from Context Studio
3. Select events:
   - ✅ Push events
   - ✅ Workflow runs
   - ✅ Pull requests
4. Save webhook

This enables instant updates when code changes!

### Branch Configuration

If you work with multiple branches:

1. **Main branch:** `main` (default)
2. **Additional branches:** `develop`, `staging` (optional)
3. **Branch strategy:** Index main branch only (recommended)

### Custom Metadata

Add custom metadata to help Bob understand your repo:

```json
{
  "repository": "ICA-GITHUB",
  "purpose": "GitHub Actions workflow automation via ICA",
  "tech_stack": ["Node.js", "Express", "GitHub API", "ngrok"],
  "main_features": [
    "Trigger workflows via API",
    "Natural language interface",
    "MCP integration"
  ]
}
```

---

## 📝 Next Steps After GitHub Connection

1. **Upload Context Data** - Add requirements, stakeholders, etc.
2. **Configure Bob** - Set up MCP server
3. **Test Integration** - Try natural language commands
4. **Monitor Usage** - Check how Bob uses GitHub data

Your Context Studio now has complete access to your repository! 🎉