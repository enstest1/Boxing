# Boxing Project - Problems & Solutions Log

## Current Issues

1. **API Connection Failure in Web App**
   - Error: "API connection failed. Check browser console for details."
   - Error: "API error (400): {"error":"ApiError","message":"No file uploaded"}"
   - Browser shows: "Failed to reach API at any URL. Errors: http://localhost:3001: Failed to fetch..."

2. **WSL/Windows Networking Issues**
   - Can't access WSL services from Windows browser
   - Port forwarding requires admin privileges
   - Cross-origin (CORS) issues between services

3. **Package Management Problems**
   - Conflicts between pnpm in WSL and Windows environments
   - "Unsupported URL Type 'workspace:': workspace:*" errors
   - Permission issues with node_modules
   - "Invalid Version" errors when installing with npm/pnpm

4. **Missing Dependencies**
   - Vite not found in WSL: "sh: 1: vite: not found"
   - TypeScript linting errors for missing type definitions

## Solutions Attempted

### API Connection

1. **Multiple API URLs Approach:**
   - Tried connecting to multiple possible URLs (localhost, 127.0.0.1, WSL IPs)
   - Added error handling to try each URL in sequence
   - Result: All connections failed with "Failed to fetch"

2. **Vite Proxy Configuration:**
   - Updated `vite.config.ts` to proxy `/api/*` requests to API server
   - Added URL rewriting: `rewrite: (path) => path.replace(/^\/api/, '')`
   - Modified API call helper to use relative URLs: `/api/endpoint` instead of absolute URLs
   - Result: Still getting connection errors

3. **CORS Configuration:**
   - Added comprehensive CORS headers to API
   - Added OPTIONS preflight request handler
   - Result: Didn't resolve cross-origin issues

4. **API Server Simplification:**
   - Simplified API to avoid path-to-regexp and other dependency issues
   - Added explicit file upload handling with express-fileupload
   - Added comprehensive logging for debugging
   - Result: API runs but still not accessible from web app

5. **Windows Proxy Solution:**
   - Created a dedicated proxy server in Windows using Express
   - Configured the proxy to forward requests from Windows to the WSL IP
   - Updated Vite configuration to use the Windows proxy
   - Added debugging endpoints to the proxy
   - Result: Proxy setup was successful, but API/Web still had dependency issues

6. **Simplified API in Windows:**
   - Created a new API server implementation in Windows
   - Used basic multer setup for file uploads
   - Configured routes to match the expected API structure
   - Result: API server runs in Windows, eliminating WSL networking issues

### Development Environment

1. **Environment Access:**
   - API server runs in WSL at port 3001
   - Web server runs with issues in WSL, likely due to missing Vite
   - Added debug endpoint and test buttons for connectivity testing
   - Result: Can access API directly in WSL but not from browser

2. **Attempted Solutions for Web App:**
   - Tried installing Vite directly
   - Tried running with npm instead of pnpm
   - Result: Package manager conflicts and missing dependencies

3. **Environment Consolidation:**
   - Moved API server from WSL to Windows
   - Created clean implementation with proper dependencies
   - Setup proxy in Windows to ensure consistent networking
   - Result: API server works in Windows, but web app still has dependency issues

4. **Package Manager Issues:**
   - Encountered "Invalid Version" errors with both npm and pnpm
   - Attempted clean installs in isolated directories
   - Result: Package.json format issues persist across environments

## Proposed Next Steps

1. **Run Everything in Same Environment:**
   - Run both API and web app in Windows directly (not WSL)
   - Or run both in WSL and access through WSL IP address

2. **Create a Simple Windows Proxy:**
   - ✅ Implemented a lightweight Node.js proxy server in Windows
   - ✅ Successfully forwards requests from Windows to WSL services

3. **Fix Package Manager Issues:**
   - Create clean package.json files with valid version formats
   - Try alternative package installation approaches (yarn, npm install --no-save)
   - Consider creating a Docker environment for consistent dependencies

4. **API/Web Split Approach:**
   - ✅ Successfully run API in Windows without front-end dependency
   - Try running web app with direct npm commands like `npx vite`
   - Consider manually installing required packages one by one

5. **File Upload Specific Solutions:**
   - Verify FormData handling in client and server
   - Ensure multipart/form-data content type is properly handled

## Root Cause Analysis

The primary issue appears to be network isolation between WSL and Windows. WSL creates a virtual network that's not directly accessible from Windows applications by default. This is causing our upload failures despite both services running correctly in isolation.

The secondary issues with package management stem from inconsistent environments between WSL and Windows, leading to dependency resolution problems and missing packages. The "Invalid Version" errors suggest problematic package.json formatting that's not compatible with the npm/pnpm versions being used.
