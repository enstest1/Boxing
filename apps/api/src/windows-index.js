// Simple Express API for Windows environment
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true, environment: 'windows' });
});

// File upload endpoint - simplified to return mock data
app.post('/api/v1/songs', (req, res) => {
  const mockResponse = {
    id: Date.now().toString(),
    name: 'example-song.mp3',
    url: `http://localhost:${PORT}/uploads/example-song.mp3`
  };
  
  console.log('Mock file uploaded:', mockResponse);
  res.status(201).json(mockResponse);
});

// Debug endpoint
app.get('/debug', (req, res) => {
  res.json({
    status: 'API is running in Windows mode',
    time: new Date().toISOString(),
    headers: req.headers,
    ip: req.ip
  });
});

// Serve static files
app.use('/uploads', express.static(uploadsDir));

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running in Windows mode on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`File uploads: http://localhost:${PORT}/api/v1/songs`);
  console.log(`Debug endpoint: http://localhost:${PORT}/debug`);
}); 