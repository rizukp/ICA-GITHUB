# ICA GitHub Trigger Service

A Node.js service that allows ICA (Intelligent Code Assistant) to trigger GitHub Actions workflows through ngrok tunneling.

## 🏗️ Architecture

```
ICA → ngrok (public URL) → Local Node.js Service → GitHub API → GitHub Actions
```

## 📋 Prerequisites

- Node.js (v18 or higher)
- GitHub account with repository access
- ngrok account (free tier works)
- GitHub Personal Access Token

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Navigate to your project directory
cd c:/Users/MuhammedRizwanKP/Desktop/ICA-GITHUB

# Install dependencies
npm install
```

### 2. Configure Environment Variables

```bash
# Copy the example environment file
copy .env.example .env

# Edit .env with your actual credentials
notepad .env
```

Required environment variables:
- `GITHUB_TOKEN`: Your GitHub Personal Access Token
- `GITHUB_OWNER`: Your GitHub username (default: rizukp)
- `GITHUB_REPO`: Your repository name (default: ICA-GITHUB)
- `PORT`: Server port (default: 3000)
- `API_KEY`: Secure API key for authentication

### 3. Generate GitHub Personal Access Token

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Name: `ICA Workflow Trigger`
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Click "Generate token"
6. Copy the token and add it to your `.env` file

### 4. Generate Secure API Key

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and add it to your `.env` file as `API_KEY`.

### 5. Set Up GitHub Actions Workflow

Copy the `.github/workflows/main.yml` file to your GitHub repository:

```bash
# If you haven't cloned your repository yet
git clone https://github.com/rizukp/ICA-GITHUB.git
cd ICA-GITHUB

# Copy the workflow file
mkdir -p .github/workflows
copy ..\ICA-GITHUB\.github\workflows\main.yml .github\workflows\

# Commit and push
git add .github/workflows/main.yml
git commit -m "Add ICA triggered workflow"
git push origin main
```

### 6. Start the Node.js Service

```bash
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

### 7. Start ngrok Tunnel

In a new terminal:

```bash
# Start ngrok tunnel
ngrok http 3000
```

Copy the public URL (e.g., `https://abc123.ngrok.io`)

## 📡 API Endpoints

### Health Check
```bash
GET /health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-06-04T09:15:00.000Z",
  "service": "ICA GitHub Trigger Service"
}
```

### Trigger Workflow
```bash
POST /trigger-workflow
Headers: 
  Content-Type: application/json
  x-api-key: your_api_key_here

Body:
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

Response:
```json
{
  "success": true,
  "message": "Workflow triggered successfully",
  "status": 204,
  "workflow": "main.yml",
  "ref": "main",
  "repository": "rizukp/ICA-GITHUB",
  "timestamp": "2026-06-04T09:15:00.000Z"
}
```

### List Workflows
```bash
GET /workflows
Headers:
  x-api-key: your_api_key_here
```

### Get Workflow Runs
```bash
GET /workflow-runs?workflow_id=main.yml&per_page=10
Headers:
  x-api-key: your_api_key_here
```

## 🧪 Testing

### Test with curl

```bash
# Health check
curl http://localhost:3000/health

# Trigger workflow (replace YOUR_API_KEY)
curl -X POST http://localhost:3000/trigger-workflow \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d "{\"workflow_id\":\"main.yml\",\"ref\":\"main\",\"inputs\":{\"task\":\"test\",\"environment\":\"development\"}}"
```

### Test with ngrok URL

```bash
# Replace with your ngrok URL
curl -X POST https://your-ngrok-url.ngrok.io/trigger-workflow \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d "{\"workflow_id\":\"main.yml\",\"ref\":\"main\",\"inputs\":{\"task\":\"build\",\"environment\":\"production\"}}"
```

## 🔐 Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use strong API keys** - Generate with crypto.randomBytes
3. **Rotate tokens regularly** - Update GitHub PAT periodically
4. **Use ngrok authentication** - Add basic auth to ngrok tunnel:
   ```bash
   ngrok http 3000 --basic-auth="username:password"
   ```
5. **Monitor access logs** - Check server logs for suspicious activity
6. **Limit token scopes** - Only grant necessary permissions

## 🔍 Monitoring

### View ngrok requests
Open http://localhost:4040 in your browser to see all requests through ngrok.

### View GitHub Actions runs
Go to https://github.com/rizukp/ICA-GITHUB/actions to see workflow executions.

### Server logs
The Node.js service logs all requests and responses to the console.

## 🛠️ Troubleshooting

### "Unauthorized" error
- Check that your `API_KEY` in `.env` matches the one in your request header
- Verify the `x-api-key` header is included in your request

### "Workflow not found" error
- Ensure the workflow file exists in `.github/workflows/` in your repository
- Check that the `workflow_id` matches the filename (e.g., `main.yml`)
- Verify the workflow has `workflow_dispatch` trigger

### "Bad credentials" error
- Verify your `GITHUB_TOKEN` is correct and not expired
- Ensure the token has `repo` and `workflow` scopes
- Generate a new token if needed

### ngrok connection issues
- Check that ngrok is running and showing a public URL
- Verify the port matches your Node.js service (default: 3000)
- Try restarting ngrok

## 📚 Workflow Inputs

The GitHub Actions workflow accepts these inputs:

- `task` (string): Task to execute (e.g., "build", "test", "deploy")
- `environment` (choice): Environment (development, staging, production)
- `message` (string): Custom message
- `debug` (boolean): Enable debug mode

## 🎯 Example ICA Integration

Configure ICA to call your ngrok URL:

```
Endpoint: https://your-ngrok-url.ngrok.io/trigger-workflow
Method: POST
Headers:
  Content-Type: application/json
  x-api-key: your_api_key_here
Body:
{
  "workflow_id": "main.yml",
  "ref": "main",
  "inputs": {
    "task": "deploy",
    "environment": "production",
    "message": "Automated deployment from ICA"
  }
}
```

## 📝 License

MIT

## 👤 Author

Repository: https://github.com/rizukp/ICA-GITHUB