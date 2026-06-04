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

### Step 11: Configure ICA (Intelligent Code Assistant)

Now you need to configure ICA to communicate with your local service through the ngrok tunnel. This allows ICA to trigger GitHub Actions workflows on your behalf.

#### What is ICA?
ICA (Intelligent Code Assistant) is an AI-powered tool that can interact with external APIs. By configuring it to use your ngrok URL, ICA can trigger workflows in your GitHub repository.

#### Configuration Steps:

1. **Get Your ngrok URL**
   - Look at the ngrok terminal window
   - Copy the HTTPS forwarding URL (e.g., `https://abc123.ngrok-free.app`)
   - **Important**: Use the HTTPS URL, not HTTP

2. **Get Your API Key**
   - Open your `.env` file
   - Copy the value of `API_KEY`
   - Example: `82679a134903d35084f7c35e25a4b4c331a2533cacc57a6b563f373a2d28e139`

3. **Configure ICA Settings**

   In your ICA configuration or when setting up an API call, use these settings:

   **Endpoint URL**:
   ```
   https://your-ngrok-url.ngrok-free.app/trigger-workflow
   ```
   Replace `your-ngrok-url.ngrok-free.app` with your actual ngrok URL

   **HTTP Method**: `POST`

   **Headers**:
   ```
   Content-Type: application/json
   x-api-key: your_api_key_from_env_file
   ```
   Replace `your_api_key_from_env_file` with your actual API key from `.env`

   **Request Body** (JSON format):
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

4. **Understanding the Request Body Parameters**:
   - `workflow_id`: The workflow file name (must match the file in `.github/workflows/`)
   - `ref`: The branch to run the workflow on (usually "main" or "master")
   - `inputs`: Custom parameters passed to the workflow
     - `task`: What action to perform (e.g., "build", "test", "deploy")
     - `environment`: Where to run (e.g., "development", "staging", "production")
     - `message`: A custom message for logging
     - `debug`: Set to "true" to enable debug output in the workflow

5. **Example: Complete ICA Configuration**

   If your ngrok URL is `https://abc123.ngrok-free.app` and your API key is `82679a134903...`, configure ICA like this:

   ```
   URL: https://abc123.ngrok-free.app/trigger-workflow
   Method: POST
   
   Headers:
   Content-Type: application/json
   x-api-key: 82679a134903d35084f7c35e25a4b4c331a2533cacc57a6b563f373a2d28e139
   
   Body:
   {
     "workflow_id": "main.yml",
     "ref": "main",
     "inputs": {
       "task": "deploy",
       "environment": "production",
       "message": "Automated deployment from ICA",
       "debug": "false"
     }
   }
   ```

6. **Test the Configuration**
   - Save your ICA configuration
   - Trigger a test request from ICA
   - Check the Node.js service terminal for logs
   - Verify the workflow runs on GitHub: https://github.com/rizukp/ICA-GITHUB/actions

7. **Troubleshooting ICA Connection**:
   - **"Connection refused"**: Make sure both Node.js service and ngrok are running
   - **"Unauthorized"**: Verify your API key is correct and matches the one in `.env`
   - **"Workflow not found"**: Check that `main.yml` exists in your repository's `.github/workflows/` folder
   - **ngrok URL changed**: ngrok free tier generates a new URL each restart - update ICA with the new URL

#### Alternative: Using ICA with MCP (Model Context Protocol)

If your ICA supports MCP, you can configure it to use the service more dynamically:

1. Set up an MCP server pointing to your ngrok URL
2. Define the API schema for the `/trigger-workflow` endpoint
3. ICA can then discover and use the endpoint automatically

#### Security Notes:
- Never share your API key publicly
- The ngrok URL is temporary (changes on restart with free tier)
- Consider upgrading to ngrok paid plan for a permanent URL
- Monitor the ngrok inspector at http://localhost:4040 to see all requests

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


## 🔌 ICA Integration Guide

### Option 1: Using MCP (Model Context Protocol) - Recommended

MCP allows ICA to discover and use your API automatically. Here's how to set it up:

#### Step 1: Create MCP Server Configuration

Create a new file `mcp-config.json` in your project directory:

```json
{
  "mcpServers": {
    "github-workflow-trigger": {
      "command": "node",
      "args": ["mcp-server.js"],
      "env": {
        "API_BASE_URL": "http://localhost:3000"
      }
    }
  }
}
```

#### Step 2: Create MCP Server Script

Create `mcp-server.js` in your project directory:

```javascript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const API_KEY = process.env.API_KEY;

const server = new Server(
  {
    name: 'github-workflow-trigger',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'trigger_github_workflow',
        description: 'Trigger a GitHub Actions workflow in the ICA-GITHUB repository',
        inputSchema: {
          type: 'object',
          properties: {
            workflow_id: {
              type: 'string',
              description: 'The workflow file name (e.g., main.yml)',
              default: 'main.yml'
            },
            ref: {
              type: 'string',
              description: 'The git branch to run the workflow on',
              default: 'main'
            },
            task: {
              type: 'string',
              description: 'The task to execute (e.g., build, test, deploy)',
              default: 'build'
            },
            environment: {
              type: 'string',
              enum: ['development', 'staging', 'production'],
              description: 'The environment to run in',
              default: 'development'
            },
            message: {
              type: 'string',
              description: 'Custom message for the workflow run',
              default: 'Triggered by ICA via MCP'
            },
            debug: {
              type: 'string',
              enum: ['true', 'false'],
              description: 'Enable debug mode',
              default: 'false'
            }
          },
          required: ['workflow_id', 'ref']
        }
      },
      {
        name: 'list_github_workflows',
        description: 'List all available GitHub Actions workflows in the repository',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'get_workflow_runs',
        description: 'Get recent workflow runs for a specific workflow',
        inputSchema: {
          type: 'object',
          properties: {
            workflow_id: {
              type: 'string',
              description: 'The workflow file name',
              default: 'main.yml'
            },
            per_page: {
              type: 'number',
              description: 'Number of runs to retrieve',
              default: 10
            }
          }
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'trigger_github_workflow': {
        const response = await fetch(`${API_BASE_URL}/trigger-workflow`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
          },
          body: JSON.stringify({
            workflow_id: args.workflow_id || 'main.yml',
            ref: args.ref || 'main',
            inputs: {
              task: args.task || 'build',
              environment: args.environment || 'development',
              message: args.message || 'Triggered by ICA via MCP',
              debug: args.debug || 'false'
            }
          })
        });

        const data = await response.json();
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2)
            }
          ]
        };
      }

      case 'list_github_workflows': {
        const response = await fetch(`${API_BASE_URL}/workflows`, {
          headers: {
            'x-api-key': API_KEY
          }
        });

        const data = await response.json();
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2)
            }
          ]
        };
      }

      case 'get_workflow_runs': {
        const workflow_id = args.workflow_id || 'main.yml';
        const per_page = args.per_page || 10;
        
        const response = await fetch(
          `${API_BASE_URL}/workflow-runs?workflow_id=${workflow_id}&per_page=${per_page}`,
          {
            headers: {
              'x-api-key': API_KEY
            }
          }
        );

        const data = await response.json();
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2)
            }
          ]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`
        }
      ],
      isError: true
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('GitHub Workflow Trigger MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
```

#### Step 3: Install MCP SDK

```bash
npm install @modelcontextprotocol/sdk node-fetch
```

#### Step 4: Update package.json

Add this to your `package.json`:

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0",
    "node-fetch": "^3.3.2"
  }
}
```

#### Step 5: Configure ICA to Use MCP

1. Open ICA Settings
2. Go to **MCP Servers** section
3. Click **Add Server**
4. Enter the configuration:
   - **Name**: `github-workflow-trigger`
   - **Command**: `node`
   - **Args**: `["C:/Users/MuhammedRizwanKP/Desktop/ICA-GITHUB/mcp-server.js"]`
   - **Environment Variables**:
     - `API_BASE_URL`: `http://localhost:3000`
     - `API_KEY`: (your API key from .env)

5. Save and restart ICA

#### Step 6: Test MCP Integration

In ICA, you can now use natural language commands like:
- "Trigger the GitHub workflow to build the project"
- "List all available workflows"
- "Show me the recent workflow runs"
- "Deploy to production environment"

ICA will automatically discover and use the MCP tools you've defined.

---

### Option 2: Using Context Studio (Direct API Integration)

If you prefer to use Context Studio without MCP:

#### Step 1: Create API Schema File

Create `api-schema.json`:

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "GitHub Workflow Trigger API",
    "version": "1.0.0",
    "description": "API to trigger GitHub Actions workflows via ICA"
  },
  "servers": [
    {
      "url": "https://your-ngrok-url.ngrok-free.app",
      "description": "ngrok tunnel to local service"
    }
  ],
  "security": [
    {
      "ApiKeyAuth": []
    }
  ],
  "paths": {
    "/health": {
      "get": {
        "summary": "Health check",
        "responses": {
          "200": {
            "description": "Service is healthy"
          }
        }
      }
    },
    "/trigger-workflow": {
      "post": {
        "summary": "Trigger a GitHub Actions workflow",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "workflow_id": {
                    "type": "string",
                    "default": "main.yml",
                    "description": "Workflow file name"
                  },
                  "ref": {
                    "type": "string",
                    "default": "main",
                    "description": "Git branch"
                  },
                  "inputs": {
                    "type": "object",
                    "properties": {
                      "task": {
                        "type": "string",
                        "enum": ["build", "test", "deploy"],
                        "description": "Task to execute"
                      },
                      "environment": {
                        "type": "string",
                        "enum": ["development", "staging", "production"],
                        "description": "Target environment"
                      },
                      "message": {
                        "type": "string",
                        "description": "Custom message"
                      },
                      "debug": {
                        "type": "string",
                        "enum": ["true", "false"],
                        "description": "Enable debug mode"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Workflow triggered successfully"
          }
        }
      }
    },
    "/workflows": {
      "get": {
        "summary": "List all workflows",
        "responses": {
          "200": {
            "description": "List of workflows"
          }
        }
      }
    },
    "/workflow-runs": {
      "get": {
        "summary": "Get recent workflow runs",
        "parameters": [
          {
            "name": "workflow_id",
            "in": "query",
            "schema": {
              "type": "string",
              "default": "main.yml"
            }
          },
          {
            "name": "per_page",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 10
            }
          }
        ],
        "responses": {
          "200": {
            "description": "List of workflow runs"
          }
        }
      }
    }
  },
  "components": {
    "securitySchemes": {
      "ApiKeyAuth": {
        "type": "apiKey",
        "in": "header",
        "name": "x-api-key"
      }
    }
  }
}
```

#### Step 2: Import Schema to Context Studio

1. Open ICA
2. Go to **Context Studio**
3. Click **Import API Schema**
4. Select `api-schema.json`
5. Update the server URL with your ngrok URL
6. Add your API key in the authentication section

#### Step 3: Create Context Actions

In Context Studio, create actions for common tasks:

**Action 1: Deploy to Production**
```json
{
  "name": "Deploy to Production",
  "endpoint": "/trigger-workflow",
  "method": "POST",
  "body": {
    "workflow_id": "main.yml",
    "ref": "main",
    "inputs": {
      "task": "deploy",
      "environment": "production",
      "message": "Production deployment from ICA",
      "debug": "false"
    }
  }
}
```

**Action 2: Run Tests**
```json
{
  "name": "Run Tests",
  "endpoint": "/trigger-workflow",
  "method": "POST",
  "body": {
    "workflow_id": "main.yml",
    "ref": "main",
    "inputs": {
      "task": "test",
      "environment": "development",
      "message": "Running tests from ICA",
      "debug": "true"
    }
  }
}
```

#### Step 4: Use in ICA

You can now:
- Use the actions from Context Studio menu
- Reference them in conversations: "Run the Deploy to Production action"
- ICA will execute the API calls automatically

---

### Quick Comparison: MCP vs Context Studio

| Feature | MCP | Context Studio |
|---------|-----|----------------|
| Setup Complexity | Medium | Easy |
| Flexibility | High | Medium |
| Natural Language | Excellent | Good |
| Auto-discovery | Yes | No |
| Maintenance | Low | Medium |
| Best For | Dynamic workflows | Fixed actions |

**Recommendation**: Use **MCP** for better integration and natural language support. Use **Context Studio** if you want quick setup with predefined actions.
