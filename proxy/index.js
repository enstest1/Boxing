const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();

// API is now running in Windows, so use localhost
const API_HOST = 'localhost';
const API_PORT = 3001;
const PROXY_PORT = 3002;

// Enable CORS
app.use(cors());

// Create proxy to API running in Windows
app.use('/api', createProxyMiddleware({
  target: `http://${API_HOST}:${API_PORT}`,
  changeOrigin: true,
  pathRewrite: {'^/api': ''},
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error', message: err.message });
  }
}));

// Debug endpoint to check proxy connectivity
app.get('/proxy-status', (req, res) => {
  res.json({
    status: 'Proxy is running',
    time: new Date().toISOString(),
    apiTarget: `http://${API_HOST}:${API_PORT}`
  });
});

// Start the proxy server
app.listen(PROXY_PORT, '0.0.0.0', () => {
  console.log(`Proxy server running at http://localhost:${PROXY_PORT}`);
  console.log(`Forwarding API requests to http://${API_HOST}:${API_PORT}`);
  console.log(`Check status at http://localhost:${PROXY_PORT}/proxy-status`);
}); 