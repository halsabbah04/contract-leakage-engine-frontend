# Build and Run Instructions

## Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Azure account (for deployment)

---

## Quick Start (Development)

### 1. Build Shared Types Package

The shared types package must be built first as both frontend and backend depend on it.

```bash
# Navigate to shared-types directory
cd ../contract-leakage-engine-backend/shared-types

# Install dependencies
npm install

# Build the package
npm run build
```

**Expected output:**
- `dist/` directory created with compiled JavaScript
- `dist/index.d.ts` and other type definition files

---

### 2. Install Frontend Dependencies

```bash
# Navigate back to frontend directory
cd ../../contract-leakage-engine-frontend

# Install all dependencies (including local shared-types package)
npm install
```

**This will:**
- Install all npm packages from package.json
- Link the local `@contract-leakage/shared-types` package
- Set up TypeScript path aliases

---

### 3. Run Frontend Development Server

```bash
npm run dev
```

**Expected output:**
```
VITE v5.0.11  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
➜  press h to show help
```

**Frontend will be available at:** http://localhost:3000

---

### 4. Run Backend (Azure Functions)

In a separate terminal:

```bash
# Navigate to backend directory
cd ../contract-leakage-engine-backend

# Activate virtual environment
.venv\Scripts\activate  # Windows
# OR
source .venv/bin/activate  # Mac/Linux

# Install dependencies (if not already done)
pip install -r requirements.txt

# Start Azure Functions runtime
func start
```

**Expected output:**
```
Azure Functions Core Tools
Core Tools Version: 4.x.x

Functions:
  upload_contract: [POST] http://localhost:7071/api/upload_contract
  analyze_contract: [POST] http://localhost:7071/api/analyze_contract
  get_contract: [GET] http://localhost:7071/api/get_contract/{contract_id}
  get_clauses: [GET] http://localhost:7071/api/get_clauses/{contract_id}
  get_findings: [GET] http://localhost:7071/api/get_findings/{contract_id}
  export_report: [GET] http://localhost:7071/api/export_report/{contract_id}
  create_override: [POST] http://localhost:7071/api/overrides/{contract_id}
  get_overrides: [GET] http://localhost:7071/api/overrides/{contract_id}
```

**Backend will be available at:** http://localhost:7071

---

## Build Commands

### Shared Types

```bash
cd ../contract-leakage-engine-backend/shared-types
npm run build          # Compile TypeScript
npm run watch          # Watch mode (auto-rebuild on changes)
```

### Frontend

```bash
cd ../../contract-leakage-engine-frontend
npm run dev            # Development server
npm run build          # Production build
npm run preview        # Preview production build
npm run type-check     # TypeScript type checking only
npm run lint           # ESLint
```

### Backend

```bash
cd ../contract-leakage-engine-backend
func start             # Start Azure Functions locally
python -m pytest       # Run tests
```

---

## Troubleshooting

### Issue: "Cannot find module '@contract-leakage/shared-types'"

**Solution:**
1. Build shared-types first: `cd ../contract-leakage-engine-backend/shared-types && npm run build`
2. Reinstall frontend dependencies: `cd ../../contract-leakage-engine-frontend && npm install`
3. Restart TypeScript server in VS Code: Press `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

### Issue: "Cannot find module '@services'"

**Solution:**
- Make sure you're using relative imports (`../services`) instead of path aliases (`@services`)
- The path aliases are configured but may not work until `npm install` is run

### Issue: Port 3000 or 7071 already in use

**Solution:**
```bash
# Windows - Find and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Issue: Azure Functions not starting

**Solution:**
1. Check Python virtual environment is activated
2. Install Azure Functions Core Tools: `npm install -g azure-functions-core-tools@4`
3. Verify `local.settings.json` exists in backend directory

### Issue: TypeScript errors in IDE

**Solution:**
1. Ensure shared-types is built: `cd ../contract-leakage-engine-backend/shared-types && npm run build`
2. Restart TypeScript server: Press `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
3. Close and reopen VS Code

---

## Development Workflow

### Making Changes to Shared Types

1. Edit files in `shared-types/src/`
2. Rebuild: `npm run build` (or use watch mode: `npm run watch`)
3. Restart frontend dev server to pick up changes

### Recommended Setup

**Terminal 1 - Shared Types (watch mode):**
```bash
cd ../contract-leakage-engine-backend/shared-types
npm run watch
```

**Terminal 2 - Backend:**
```bash
cd ../contract-leakage-engine-backend
.venv\Scripts\activate
func start
```

**Terminal 3 - Frontend:**
```bash
cd contract-leakage-engine-frontend
npm run dev
```

---

## Environment Variables

### Backend (`local.settings.json`)

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "python",
    "COSMOS_DB_ENDPOINT": "<your-cosmos-endpoint>",
    "COSMOS_DB_KEY": "<your-cosmos-key>",
    "BLOB_STORAGE_CONNECTION_STRING": "<your-blob-connection>",
    "OPENAI_API_KEY": "<your-openai-key>",
    "OPENAI_ENDPOINT": "<your-azure-openai-endpoint>",
    "SEARCH_ENDPOINT": "<your-search-endpoint>",
    "SEARCH_API_KEY": "<your-search-key>"
  }
}
```

### Frontend (`.env.local`)

```env
VITE_API_BASE_URL=http://localhost:7071/api
```

---

## Next Steps

After successful local development setup:

1. ✅ Test contract upload workflow
2. ✅ Test clause extraction
3. ✅ Test findings analysis
4. ✅ Test user overrides
5. ✅ Test export functionality
6. 📋 Deploy to Azure (Task 19)

---

## Deployment (Task 19)

See `DEPLOYMENT_GUIDE.md` for detailed Azure deployment instructions.

**Quick deployment checklist:**
- [ ] Build shared-types: `npm run build`
- [ ] Build frontend: `npm run build`
- [ ] Deploy backend to Azure Functions
- [ ] Deploy frontend to Azure Static Web Apps
- [ ] Configure Azure resources (Cosmos DB, Blob Storage, AI Search, OpenAI)
- [ ] Update environment variables
- [ ] Test end-to-end in production
