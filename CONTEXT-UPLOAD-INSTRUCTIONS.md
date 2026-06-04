# Context Studio - Data Upload Instructions

## 📋 Overview

You now have the schema uploaded. Next, you need to add **Context** (data) and **Sources** (documentation) to Context Studio.

---

## Step 1: Add Context (Data Files)

Context files contain the actual data instances that conform to your schema.

### 1.1 Navigate to Context Section

1. In Context Studio, find your published schema: **"GitHub Workflow Trigger Requirement"**
2. Click on the schema to open it
3. Look for **"Context"** or **"Data"** tab/section
4. Click **"Add Context"** or **"Upload Data"**

### 1.2 Upload Data Files (in order)

Upload these JSON files one by one:

#### File 1: Requirements Data
- **File**: `context-data-requirements.json`
- **Type**: Requirements
- **Description**: Functional, non-functional, and security requirements
- **Contains**: 8 requirements (3 functional, 2 non-functional, 3 security)

#### File 2: Stakeholders Data
- **File**: `context-data-stakeholders.json`
- **Type**: Stakeholders
- **Description**: People and teams involved in the system
- **Contains**: 4 stakeholders (Developer, DevOps Engineer, Development Team, Security Team)

#### File 3: Goals and Use Cases Data
- **File**: `context-data-goals-usecases.json`
- **Type**: Goals and Use Cases
- **Description**: System objectives and usage scenarios
- **Contains**: 5 goals and 4 use cases

#### File 4: Test Cases Data
- **File**: `context-data-testcases.json`
- **Type**: Test Cases
- **Description**: Verification and validation tests
- **Contains**: 10 test cases (integration, security, performance, acceptance)

### 1.3 Verify Data Upload

After each upload:
- ✅ Check for success message
- ✅ Verify data appears in the context list
- ✅ Check for any validation errors
- ✅ Ensure relationships are recognized

---

## Step 2: Add Sources (Documentation Files)

Sources are documentation files that provide additional context and information.

### 2.1 Navigate to Sources Section

1. In Context Studio, stay in your schema
2. Look for **"Sources"** or **"Documentation"** tab
3. Click **"Add Source"** or **"Upload Document"**

### 2.2 Upload Documentation Files

Upload these files as sources:

#### Source 1: README
- **File**: `README.md`
- **Type**: Documentation
- **Priority**: High
- **Description**: Main project documentation with API overview

#### Source 2: Setup Guide
- **File**: `SETUP-GUIDE.md`
- **Type**: Documentation
- **Priority**: High
- **Description**: Complete setup instructions for the system

#### Source 3: Context Studio Guide
- **File**: `CONTEXT-STUDIO-GUIDE.md`
- **Type**: Documentation
- **Priority**: High
- **Description**: Detailed Context Studio integration guide

#### Source 4: API Schema
- **File**: `context-studio-sro-schema.json`
- **Type**: API Reference
- **Priority**: Medium
- **Description**: Complete SRO schema definition

### 2.3 Wait for Ingestion

- Context Studio will process and index the documents
- This usually takes 1-3 minutes per file
- Wait for **"Ingested"** or **"Ready"** status before proceeding
- Green checkmark indicates successful ingestion

---

## Step 3: Verify Context and Sources

### 3.1 Check Context Data

1. Go to **Context** tab
2. Verify you see:
   - ✅ 8 Requirements
   - ✅ 4 Stakeholders
   - ✅ 5 Goals
   - ✅ 4 Use Cases
   - ✅ 10 Test Cases

2. Click on a few items to verify details are correct

### 3.2 Check Sources

1. Go to **Sources** tab
2. Verify all 4 documentation files show **"Ingested"** status
3. Try searching for keywords to test indexing

### 3.3 Test Relationships

1. Open a requirement (e.g., FR-001)
2. Check if related items are linked:
   - Stakeholders who requested it
   - Goals it supports
   - Test cases that verify it
   - Use cases it enables

---

## Step 4: Create MCP Server (Next Step)

Once Context and Sources are added, proceed to create the MCP server:

### 4.1 Install Dependencies

```powershell
npm install @modelcontextprotocol/sdk node-fetch
```

### 4.2 Configure MCP in Context Studio

1. Go to **MCP Servers** section
2. Click **Add MCP Server**
3. Configure:
   - **Name**: `github-workflow-trigger`
   - **Command**: `node`
   - **Args**: `["C:/Users/MuhammedRizwanKP/Desktop/ICA-GITHUB/mcp-server.js"]`
   - **Environment Variables**:
     - `API_BASE_URL`: `http://localhost:3000`
     - `API_KEY`: (your API key from .env)

4. Click **Save** and **Start Server**

### 4.3 Verify MCP Server

- Status should show **"Running"** (green)
- Check logs for any errors
- Test with a simple command

---

## Step 5: Test the Complete System

### 5.1 Test with Natural Language

In ICA chat, try these commands:

```
"Deploy to production"
"Run the automated tests"
"Show me recent workflow runs"
"Build the application for staging"
```

### 5.2 Verify Results

- ✅ ICA understands the command
- ✅ Workflow triggers on GitHub
- ✅ ICA reports success/failure
- ✅ You can see the run on GitHub Actions

---

## 📊 Summary of Files to Upload

### Context (Data) Files:
1. ✅ `context-data-requirements.json` - 8 requirements
2. ✅ `context-data-stakeholders.json` - 4 stakeholders
3. ✅ `context-data-goals-usecases.json` - 5 goals, 4 use cases
4. ✅ `context-data-testcases.json` - 10 test cases

### Sources (Documentation) Files:
1. ✅ `README.md` - Project overview
2. ✅ `SETUP-GUIDE.md` - Setup instructions
3. ✅ `CONTEXT-STUDIO-GUIDE.md` - Integration guide
4. ✅ `context-studio-sro-schema.json` - Schema reference

---

## 🔧 Troubleshooting

### Issue: "Invalid data format"
**Solution:**
- Verify JSON files are valid (use JSON validator)
- Check that @type matches schema entities
- Ensure all required fields are present

### Issue: "Schema not found"
**Solution:**
- Make sure schema is published
- Refresh Context Studio page
- Re-select the schema

### Issue: "Ingestion failed"
**Solution:**
- Check file size (should be < 10MB)
- Verify file encoding is UTF-8
- Try uploading again

### Issue: "Relationships not showing"
**Solution:**
- Verify @id references match between files
- Check that relationship operations are defined in schema
- Wait for full ingestion to complete

---

## ✅ Completion Checklist

Before proceeding to MCP server setup:

- [ ] Schema published successfully
- [ ] All 4 context data files uploaded
- [ ] All 4 source documentation files uploaded
- [ ] All files show "Ingested" status
- [ ] Can view requirements, stakeholders, goals, use cases, test cases
- [ ] Relationships between entities are visible
- [ ] Search functionality works in sources

Once all checked, proceed to MCP server configuration!

---

## 🎯 What's Next?

After completing Context and Sources upload:

1. **Configure MCP Server** - Enable natural language interaction
2. **Create Actions** - Define common workflow operations
3. **Test with ICA** - Try natural language commands
4. **Monitor and Refine** - Improve based on usage

You're almost there! 🚀