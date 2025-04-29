const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();

// WSL IP address - replace with your actual WSL IP if different
const WSL_IP = '172.20.42.240';
const API_PORT = 3001;
const PROXY_PORT = 3002;

// Enable CORS
app.use(cors());

// Create proxy to API running in WSL
app.use('/api', createProxyMiddleware({
  target: `http://${WSL_IP}:${API_PORT}`,
  changeOrigin: true,
  pathRewrite: {'^/api': ''},
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error', message: err.message });
  }
}));

// Start the proxy server
app.listen(PROXY_PORT, '0.0.0.0', () => {
  console.log(`Proxy server running at http://localhost:${PROXY_PORT}`);
  console.log(`Forwarding API requests to http://${WSL_IP}:${API_PORT}`);
});
