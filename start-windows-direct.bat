@echo off
echo Setting up direct Windows access for Boxing project...

REM Create API directory structure
mkdir apps\api\node_modules 2>nul
mkdir apps\api\uploads 2>nul

REM Installing API dependencies
cd apps\api
call npm init -y
call npm install express cors
cd ..\..

REM Create web directory structure
mkdir apps\web\node_modules 2>nul

REM Installing web dependencies
cd apps\web
call npm init -y
call npm install react react-dom vite @vitejs/plugin-react
cd ..\..

REM Creating simplified API file
echo // Simple Express API > apps\api\index.js
echo const express = require('express'); >> apps\api\index.js
echo const cors = require('cors'); >> apps\api\index.js
echo const app = express(); >> apps\api\index.js
echo const PORT = 3001; >> apps\api\index.js
echo app.use(cors({origin: '*'})); >> apps\api\index.js
echo app.use(express.json()); >> apps\api\index.js
echo app.get('/health', (req, res) =^> res.json({ ok: true })); >> apps\api\index.js
echo app.post('/api/v1/songs', (req, res) =^> { >> apps\api\index.js
echo   res.status(201).json({id: Date.now().toString(), name: 'example.mp3', url: `http://localhost:${PORT}/example.mp3`}); >> apps\api\index.js
echo }); >> apps\api\index.js
echo app.listen(PORT, '0.0.0.0', () =^> { >> apps\api\index.js
echo   console.log(`API running on http://localhost:${PORT}`); >> apps\api\index.js
echo }); >> apps\api\index.js

REM Creating simplified Vite config
echo import { defineConfig } from 'vite'; > apps\web\vite.config.js
echo import react from '@vitejs/plugin-react'; >> apps\web\vite.config.js
echo export default defineConfig({ >> apps\web\vite.config.js
echo   plugins: [react()], >> apps\web\vite.config.js
echo   server: { >> apps\web\vite.config.js
echo     port: 5173, >> apps\web\vite.config.js
echo     proxy: { >> apps\web\vite.config.js
echo       '/api': { >> apps\web\vite.config.js
echo         target: 'http://localhost:3001', >> apps\web\vite.config.js
echo         changeOrigin: true >> apps\web\vite.config.js
echo       } >> apps\web\vite.config.js
echo     } >> apps\web\vite.config.js
echo   } >> apps\web\vite.config.js
echo }); >> apps\web\vite.config.js

echo Starting API server...
start cmd /k "cd apps\api && node index.js"

echo Starting web server...
start cmd /k "cd apps\web && npx vite"

echo Opening browser...
timeout /t 5
start http://localhost:5173

echo Done! Your application should now be running in separate windows.
echo API server: http://localhost:3001/health
echo Web server: http://localhost:5173 