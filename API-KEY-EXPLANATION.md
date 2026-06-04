# API Key Configuration Explained

## 🔑 What is the API_KEY?

The `API_KEY` is a **secret authentication token** that protects your Node.js service from unauthorized access.

### Your API Key:
```
82679a134903d35084f7c35e25a4b4c331a2533cacc57a6b563f373a2d28e139
```

---

## 📍 Where is it Used?

### 1. **In Your `.env` File** (Local Service)
```env
API_KEY=82679a134903d35084f7c35e25a4b4c331a2533cacc57a6b563f373a2d28e139
```

**Purpose**: Your Node.js service (`server.js`) reads this value to verify incoming requests.

**Location**: `c:/Users/MuhammedRizwanKP/Desktop/ICA-GITHUB/.env`

---

### 2. **In HTTP Request Headers** (When Calling Your API)

When making requests to your API, you must include this header:

```
x-api-key: 82679a134903d35084f7c35e25a4b4c331a2533cacc57a6b563f373a2d28e139
```

**Example with curl**:
```bash
curl -X POST https://uprising-theme-maturity.ngrok-free.dev/trigger-workflow \
  -H "Content-Type: application/json" \
  -H "x-api-key: 82679a134903d35084f7c35e25a4b4c331a2533cacc57a6b563f373a2d28e139" \
  -d '{"workflow_id":"main.yml","ref":"main"}'
```

---

### 3. **In Context Studio** (ICA Configuration)

You need to add this as an **environment variable** or **secret** in Context Studio:

**Variable Name**: `API_KEY`

**Variable Value**: `82679a134903d35084f7c35e25a4b4c331a2533cacc57a6b563f373a2d28e139`

**Type**: Secret (hidden/encrypted)

---

## 🔄 How It Works

### Step-by-Step Flow:

1. **Your Node.js Service Starts**
   - Reads `API_KEY` from `.env` file
   - Stores it in memory: `process.env.API_KEY`

2. **ICA Makes a Request**
   - ICA sends HTTP request to your API
   - Includes header: `x-api-key: 82679a134903d35084f7c35e25a4b4c331a2533cacc57a6b563f373a2d28e139`

3. **Your Service Validates**
   - Extracts `x-api-key` from request headers
   - Compares it with `process.env.API_KEY`
   - If they match → Request allowed ✅
   - If they don't match → Returns 401 Unauthorized ❌

### Code in `server.js`:
```javascript
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];  // Get from header
  
  if (apiKey !== process.env.API_KEY) {     // Compare with .env value
    return res.status(401).json({ 
      success: false, 
      error: 'Unauthorized: Invalid API key' 
    });
  }
  
  next();  // Allow request
};
```

---

## ❓ Common Questions

### Q1: Is `API_KEY` the same as `x-api-key`?

**No, they are different things:**

- **`API_KEY`** = Environment variable name (in `.env` and Context Studio)
- **`x-api-key`** = HTTP header name (in requests)
- **`82679a134903d35084f7c35e25a4b4c331a2533cacc57a6b563f373a2d28e139`** = The actual secret value

### Q2: Do I need to put the API key value in `x-api-key`?

**Yes!** When making HTTP requests, you must include:

```
Header Name: x-api-key
Header Value: 82679a134903d35084f7c35e25a4b4c331a2533cacc57a6b563f373a2d28e139
```

### Q3: Where do I configure this in Context Studio?

**In Context Studio:**

1. Go to your context: `ctx_f41f9d5f18a0`
2. Navigate to **"Environment Variables"** or **"Secrets"**
3. Click **"Add Variable"**
4. Enter:
   - **Name**: `API_KEY`
   - **Value**: `82679a134903d35084f7c35e25a4b4c331a2533cacc57a6b563f373a2d28e139`
   - **Type**: Secret
5. Save

**In Automation Configuration:**

When configuring the HTTP action, use:
```json
{
  "headers": {
    "x-api-key": "${API_KEY}"
  }
}
```

The `${API_KEY}` will be replaced with the actual value from your environment variable.

### Q4: What if the values don't match?

**You'll get this error:**
```json
{
  "success": false,
  "error": "Unauthorized: Invalid API key"
}
```

**Solution**: Ensure the value in Context Studio matches exactly with the value in your `.env` file.

---

## 🔐 Security Best Practices

### ✅ DO:
- Keep the API key secret (never commit to Git)
- Use environment variables for the key
- Rotate the key periodically
- Use HTTPS (ngrok provides this)
- Store as a "Secret" type in Context Studio

### ❌ DON'T:
- Hardcode the key in your code
- Share the key publicly
- Commit `.env` file to Git (it's in `.gitignore`)
- Use the same key across multiple services
- Send the key in URL parameters

---

## 🧪 Testing the API Key

### Test 1: Without API Key (Should Fail)
```bash
curl -X POST http://localhost:3000/trigger-workflow \
  -H "Content-Type: application/json" \
  -d '{"workflow_id":"main.yml","ref":"main"}'
```

**Expected Response**:
```json
{
  "success": false,
  "error": "Unauthorized: Invalid API key"
}
```

### Test 2: With Correct API Key (Should Succeed)
```bash
curl -X POST http://localhost:3000/trigger-workflow \
  -H "Content-Type: application/json" \
  -H "x-api-key: 82679a134903d35084f7c35e25a4b4c331a2533cacc57a6b563f373a2d28e139" \
  -d '{"workflow_id":"main.yml","ref":"main"}'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Workflow triggered successfully",
  ...
}
```

### Test 3: With Wrong API Key (Should Fail)
```bash
curl -X POST http://localhost:3000/trigger-workflow \
  -H "Content-Type: application/json" \
  -H "x-api-key: wrong-key-12345" \
  -d '{"workflow_id":"main.yml","ref":"main"}'
```

**Expected Response**:
```json
{
  "success": false,
  "error": "Unauthorized: Invalid API key"
}
```

---

## 📋 Configuration Checklist

Ensure the API key is configured in all these places:

- ✅ **`.env` file**: `API_KEY=82679a134903d35084f7c35e25a4b4c331a2533cacc57a6b563f373a2d28e139`
- ✅ **Context Studio**: Environment variable `API_KEY` with the same value
- ✅ **Automation Headers**: `"x-api-key": "${API_KEY}"`
- ✅ **Tool Configurations**: Reference `${API_KEY}` in headers
- ✅ **Test Scripts**: Include `x-api-key` header with the actual value

---

## 🎯 Summary

**Simple Answer to Your Question:**

**Yes**, you need to put the API key value (`82679a134903d35084f7c35e25a4b4c331a2533cacc57a6b563f373a2d28e139`) in the `x-api-key` header when making requests.

**The Relationship:**
```
.env file:           API_KEY = 82679a134903d35084f7c35e25a4b4c331a2533cacc57a6b563f373a2d28e139
                            ↓
Context Studio:      API_KEY = 82679a134903d35084f7c35e25a4b4c331a2533cacc57a6b563f373a2d28e139
                            ↓
HTTP Request:        x-api-key: 82679a134903d35084f7c35e25a4b4c331a2533cacc57a6b563f373a2d28e139
                            ↓
Server Validation:   Compare header value with process.env.API_KEY
                            ↓
Result:              Match = ✅ Allow | No Match = ❌ Reject
```

**They are the SAME VALUE**, just used in different places with different names!