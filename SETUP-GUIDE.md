# Complete Setup Guide for ICA GitHub Trigger Service

This guide will walk you through the complete setup process step-by-step.

## 📋 Step-by-Step Setup

### Step 1: Install Node.js Dependencies

Open PowerShell or Command Prompt in the project directory and run:

```bash
npm install
```

This will install:
- `express` - Web server framework
- `@octokit/rest` - GitHub API client
- `dotenv` - Environment variable management
- `cors` - Cross-origin resource sharing

### Step 2: Create Your Environment File

1. Copy the example file:
   ```bash
   copy .env.example .env
   ```

2. Open `.env` in a text editor (Notepad, VS Code, etc.)

### Step 3: Generate GitHub Personal Access Token

1. Go to GitHub: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Fill in the form:
   - **Note**: `ICA Workflow Trigger`
   - **Expiration**: Choose your preference (90 days recommended)
   - **Select scopes**:
     - ✅ `repo` (all sub-options)
     - ✅ `workflow`
4. Click **"Generate token"** at the bottom
5. **IMPORTANT**: Copy the token immediately (you won't see it again!)
6. Paste it in your `.env` file:
   ```
   GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### Step 4: Generate Secure API Key

Run this command in PowerShell:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and add it to your `.env` file:
```
API_KEY=your_generated_key_here
```

### Step 5: Configure Repository Settings

In your `.env` file, verify these settings:

```env
GITHUB_OWNER=rizukp
GITHUB_REPO=ICA-GITHUB
PORT=3000
```

### Step 6: Upload GitHub Actions Workflow

You need to add the workflow file to your GitHub repository:

#### Option A: Using Git (Recommended)

```bash
# Clone your repository if you haven't already
git clone https://github.com/rizukp/ICA-GITHUB.git
cd ICA-GITHUB

# Create the workflows directory
mkdir -p .github/workflows

# Copy the workflow file from your ICA-GITHUB directory
copy ..\ICA-GITHUB\.github\workflows\main.yml .github\workflows\

# Commit and push
git add .github/workflows/main.yml
git commit -m "Add ICA triggered workflow"
git push origin main
```

#### Option B: Using GitHub Web Interface

1. Go to https://github.com/rizukp/ICA-GITHUB
2. Click **"Add file"** → **"Create new file"**
3. Name it: `.github/workflows/main.yml`
4. Copy the contents from your local `.github/workflows/main.yml` file
5. Click **"Commit new file"**

### Step 7: Install ngrok

1. Download ngrok: https://ngrok.com/download
2. Extract the zip file
3. (Optional) Add ngrok to your PATH for easier access

### Step 8: Start the Services

#### Terminal 1: Start Node.js Service

```bash
# Option 1: Use the startup script
start.bat

# Option 2: Run directly
npm start
```

You should see:
```
==================================================
🚀 ICA GitHub Trigger Service Started
==================================================
📡 Server running on port 3000
🔗 Local URL: http://localhost:3000
📦 Repository: rizukp/ICA-GITHUB
🔐 API Key Auth: Enabled
==================================================
```

#### Terminal 2: Start ngrok

```bash
ngrok http 3000
```

You'll see output like:
```
Session Status                online
Account                       your-account
Version                       3.x.x
Region                        United States (us)
Forwarding                    https://abc123.ngrok.io -> http://localhost:3000
```

**Copy the HTTPS forwarding URL** (e.g., `https://abc123.ngrok.io`)

### Step 9: Test Your Setup

#### Test 1: Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-06-04T09:15:00.000Z",
  "service": "ICA GitHub Trigger Service"
}
```

#### Test 2: List Workflows

```bash
curl -X GET http://localhost:3000/workflows -H "x-api-key: YOUR_API_KEY"
```

#### Test 3: Trigger Workflow

```bash
curl -X POST http://localhost:3000/trigger-workflow ^
  -H "Content-Type: application/json" ^
  -H "x-api-key: YOUR_API_KEY" ^
  -d "{\"workflow_id\":\"main.yml\",\"ref\":\"main\",\"inputs\":{\"task\":\"test\",\"environment\":\"development\"}}"
```

Or use the test script:
```bash
test-api.bat
```

### Step 10: Verify GitHub Actions

1. Go to https://github.com/rizukp/ICA-GITHUB/actions
2. You should see a new workflow run
3. Click on it to see the execution details

### Step 11: Configure ICA

Now configure ICA to use your ngrok URL:

**Endpoint**: `https://your-ngrok-url.ngrok.io/trigger-workflow`

**Method**: `POST`

**Headers**:
```
Content-Type: application/json
x-api-key: your_api_key_from_env_file
```

**Body**:
```json
{
  "workflow_id": "main.yml",
  "ref": "main",
  "inputs": {
    "task": "build",
    "environment": "production",
    "message": "Triggered by ICA",
    "debug": "false"
  }
}
```

## 🔍 Monitoring

### View ngrok Traffic
Open http://localhost:4040 in your browser to see all HTTP requests.

### View Server Logs
Check the terminal where you ran `npm start` or `start.bat`.

### View GitHub Actions
Go to https://github.com/rizukp/ICA-GITHUB/actions

## 🛠️ Troubleshooting

### Issue: "Cannot find module 'express'"
**Solution**: Run `npm install`

### Issue: "GITHUB_TOKEN is not defined"
**Solution**: 
1. Make sure `.env` file exists
2. Check that `GITHUB_TOKEN` is set in `.env`
3. Restart the Node.js service

### Issue: "Workflow not found"
**Solution**:
1. Verify the workflow file exists in your GitHub repository
2. Check the file path: `.github/workflows/main.yml`
3. Ensure the workflow has `workflow_dispatch` trigger

### Issue: "Unauthorized" error
**Solution**:
1. Check your API key in `.env`
2. Make sure you're sending the `x-api-key` header
3. Verify the API key matches exactly

### Issue: ngrok connection refused
**Solution**:
1. Make sure Node.js service is running first
2. Check that the port matches (default: 3000)
3. Try restarting ngrok

### Issue: "Bad credentials" from GitHub
**Solution**:
1. Verify your GitHub token is correct
2. Check token hasn't expired
3. Ensure token has `repo` and `workflow` scopes
4. Generate a new token if needed

## 🔐 Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] Strong API key generated (32+ characters)
- [ ] GitHub token has minimal required scopes
- [ ] ngrok URL is kept private
- [ ] Server logs don't expose sensitive data
- [ ] API key is not hardcoded anywhere

## 📝 Daily Usage

1. Start Node.js service: `start.bat`
2. Start ngrok: `ngrok http 3000`
3. Copy ngrok URL
4. Configure ICA with the ngrok URL
5. Trigger workflows from ICA

## 🔄 Updating ngrok URL

ngrok generates a new URL each time you restart it (on free plan). When this happens:

1. Copy the new ngrok URL
2. Update ICA configuration with the new URL
3. Test the connection

**Tip**: Consider upgrading to ngrok paid plan for a permanent URL.

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Octokit REST API](https://octokit.github.io/rest.js/)
- [ngrok Documentation](https://ngrok.com/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

## 🎯 Next Steps

1. Customize the workflow in `.github/workflows/main.yml` for your needs
2. Add more endpoints to `server.js` if needed
3. Set up notifications (Slack, Discord, Email)
4. Add logging and monitoring
5. Consider deploying to a cloud service for 24/7 availability

## ❓ Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review server logs for error messages
3. Check ngrok inspector at http://localhost:4040
4. Verify GitHub Actions logs in your repository