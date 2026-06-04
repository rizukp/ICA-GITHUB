import express from 'express';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Key authentication middleware
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!process.env.API_KEY) {
    console.warn('Warning: API_KEY not set in environment variables. Authentication disabled.');
    return next();
  }
  
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ 
      success: false, 
      error: 'Unauthorized: Invalid API key' 
    });
  }
  
  next();
};

// Initialize Octokit with GitHub token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// GitHub repository configuration
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'rizukp';
const GITHUB_REPO = process.env.GITHUB_REPO || 'T1';

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'ICA GitHub Trigger Service'
  });
});

// Endpoint to trigger GitHub Actions workflow
app.post('/trigger-workflow', authenticateApiKey, async (req, res) => {
  try {
    const { 
      workflow_id = 'main.yml', 
      ref = 'main', 
      inputs = {} 
    } = req.body;

    console.log(`Triggering workflow: ${workflow_id} on ${GITHUB_OWNER}/${GITHUB_REPO}@${ref}`);
    console.log('Inputs:', JSON.stringify(inputs, null, 2));

    // Trigger the workflow
    const response = await octokit.actions.createWorkflowDispatch({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      workflow_id: workflow_id,
      ref: ref,
      inputs: inputs
    });

    console.log('Workflow triggered successfully');

    res.json({
      success: true,
      message: 'Workflow triggered successfully',
      status: response.status,
      workflow: workflow_id,
      ref: ref,
      repository: `${GITHUB_OWNER}/${GITHUB_REPO}`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error triggering workflow:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data || 'No additional details available'
    });
  }
});

// Endpoint to list available workflows
app.get('/workflows', authenticateApiKey, async (req, res) => {
  try {
    const response = await octokit.actions.listRepoWorkflows({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO
    });

    const workflows = response.data.workflows.map(workflow => ({
      id: workflow.id,
      name: workflow.name,
      path: workflow.path,
      state: workflow.state
    }));

    res.json({
      success: true,
      repository: `${GITHUB_OWNER}/${GITHUB_REPO}`,
      workflows: workflows,
      total: workflows.length
    });

  } catch (error) {
    console.error('Error fetching workflows:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint to get recent workflow runs
app.get('/workflow-runs', authenticateApiKey, async (req, res) => {
  try {
    const { workflow_id = 'main.yml', per_page = 10 } = req.query;

    const response = await octokit.actions.listWorkflowRuns({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      workflow_id: workflow_id,
      per_page: parseInt(per_page)
    });

    const runs = response.data.workflow_runs.map(run => ({
      id: run.id,
      name: run.name,
      status: run.status,
      conclusion: run.conclusion,
      created_at: run.created_at,
      updated_at: run.updated_at,
      html_url: run.html_url
    }));

    res.json({
      success: true,
      workflow: workflow_id,
      runs: runs,
      total: runs.length
    });

  } catch (error) {
    console.error('Error fetching workflow runs:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 ICA GitHub Trigger Service Started');
  console.log('='.repeat(50));
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log(`📦 Repository: ${GITHUB_OWNER}/${GITHUB_REPO}`);
  console.log(`🔐 API Key Auth: ${process.env.API_KEY ? 'Enabled' : 'Disabled (Warning!)'}`);
  console.log('='.repeat(50));
  console.log('\nAvailable endpoints:');
  console.log(`  GET  /health - Health check`);
  console.log(`  POST /trigger-workflow - Trigger a workflow`);
  console.log(`  GET  /workflows - List all workflows`);
  console.log(`  GET  /workflow-runs - Get recent workflow runs`);
  console.log('='.repeat(50));
});

// Made with Bob
