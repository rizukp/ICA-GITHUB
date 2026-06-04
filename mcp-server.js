import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const API_KEY = process.env.API_KEY;

// Create MCP server
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
        description: 'Trigger a GitHub Actions workflow in the ICA-GITHUB repository. Use this to deploy, build, test, or run any workflow.',
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
              enum: ['build', 'test', 'deploy', 'default task'],
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
              description: 'Enable debug mode for detailed logs',
              default: 'false'
            }
          },
          required: ['workflow_id', 'ref']
        }
      },
      {
        name: 'list_github_workflows',
        description: 'List all available GitHub Actions workflows in the ICA-GITHUB repository',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'get_workflow_runs',
        description: 'Get recent workflow runs for a specific workflow. Use this to check deployment status or test results.',
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
              description: 'Number of runs to retrieve (1-100)',
              default: 10,
              minimum: 1,
              maximum: 100
            }
          },
          required: []
        }
      },
      {
        name: 'check_service_health',
        description: 'Check if the GitHub workflow trigger service is running and healthy',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
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
        console.error(`[MCP] Triggering workflow: ${args.workflow_id || 'main.yml'}`);
        
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

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        
        console.error(`[MCP] Workflow triggered successfully`);
        
        return {
          content: [
            {
              type: 'text',
              text: `✅ Workflow triggered successfully!\n\n${JSON.stringify(data, null, 2)}\n\nView on GitHub: https://github.com/rizukp/ICA-GITHUB/actions`
            }
          ]
        };
      }

      case 'list_github_workflows': {
        console.error(`[MCP] Listing workflows`);
        
        const response = await fetch(`${API_BASE_URL}/workflows`, {
          headers: {
            'x-api-key': API_KEY
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        
        console.error(`[MCP] Found ${data.total} workflows`);
        
        return {
          content: [
            {
              type: 'text',
              text: `📋 Available Workflows:\n\n${JSON.stringify(data, null, 2)}`
            }
          ]
        };
      }

      case 'get_workflow_runs': {
        const workflow_id = args.workflow_id || 'main.yml';
        const per_page = args.per_page || 10;
        
        console.error(`[MCP] Getting workflow runs for ${workflow_id}`);
        
        const response = await fetch(
          `${API_BASE_URL}/workflow-runs?workflow_id=${workflow_id}&per_page=${per_page}`,
          {
            headers: {
              'x-api-key': API_KEY
            }
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        
        console.error(`[MCP] Found ${data.total} workflow runs`);
        
        // Format the runs for better readability
        let formattedText = `📊 Recent Workflow Runs for ${workflow_id}:\n\n`;
        
        if (data.runs && data.runs.length > 0) {
          data.runs.forEach((run, index) => {
            const statusEmoji = run.conclusion === 'success' ? '✅' : 
                               run.conclusion === 'failure' ? '❌' : 
                               run.status === 'in_progress' ? '🔄' : '⏸️';
            
            formattedText += `${index + 1}. ${statusEmoji} ${run.name}\n`;
            formattedText += `   Status: ${run.status}\n`;
            formattedText += `   Conclusion: ${run.conclusion || 'N/A'}\n`;
            formattedText += `   Created: ${run.created_at}\n`;
            formattedText += `   URL: ${run.html_url}\n\n`;
          });
        } else {
          formattedText += 'No workflow runs found.\n';
        }
        
        formattedText += `\nTotal runs: ${data.total}`;
        
        return {
          content: [
            {
              type: 'text',
              text: formattedText
            }
          ]
        };
      }

      case 'check_service_health': {
        console.error(`[MCP] Checking service health`);
        
        const response = await fetch(`${API_BASE_URL}/health`);

        if (!response.ok) {
          throw new Error(`Service is not responding (HTTP ${response.status})`);
        }

        const data = await response.json();
        
        console.error(`[MCP] Service is healthy`);
        
        return {
          content: [
            {
              type: 'text',
              text: `✅ Service is healthy!\n\n${JSON.stringify(data, null, 2)}`
            }
          ]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error(`[MCP] Error: ${error.message}`);
    
    return {
      content: [
        {
          type: 'text',
          text: `❌ Error: ${error.message}\n\nPlease check:\n- Node.js service is running (npm start)\n- ngrok tunnel is active\n- API key is correct in .env file`
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
  console.error(`API Base URL: ${API_BASE_URL}`);
  console.error(`API Key configured: ${API_KEY ? 'Yes' : 'No'}`);
}

main().catch((error) => {
  console.error('Fatal error in MCP server:', error);
  process.exit(1);
});

// Made with Bob
