// Simple Express API for Windows environment
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3001;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

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

// File upload endpoint
app.post('/api/v1/songs', upload.single('file'), (req, res) => {
  try {
    console.log('Received upload request:', req.file);
    
    // If no file was uploaded, return an error
    if (!req.file) {
      console.log('No file provided in request');
      return res.status(400).json({ 
        error: "ApiError", 
        message: "No file uploaded" 
      });
    }
    
    // Create response with file details
    const response = {
      id: Date.now().toString(),
      name: req.file.originalname,
      url: `http://localhost:${PORT}/uploads/${req.file.filename}`
    };
    
    console.log('File uploaded successfully:', response);
    res.status(201).json(response);
  } catch (error) {
    console.error('Error handling upload:', error);
    res.status(500).json({ 
      error: "ApiError", 
      message: "Error processing upload: " + error.message 
    });
  }
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