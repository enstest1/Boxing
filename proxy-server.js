const http = require('http');
const httpProxy = require('http-proxy');

// Create the proxy server
const proxy = httpProxy.createProxyServer({});

// Configure the proxy targets - try multiple WSL IP addresses
const targets = [
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'http://172.20.42.240:3001', // WSL IP from logs
  'http://10.88.0.1:3001'      // Another possible WSL IP
];

// Current target index
let currentTargetIndex = 0;

// Handle proxy errors
proxy.on('error', (err, req, res) => {
  console.error(`Proxy error with target ${targets[currentTargetIndex]}:`, err);
  
  // Try the next target
  currentTargetIndex = (currentTargetIndex + 1) % targets.length;
  console.log(`Switching to next target: ${targets[currentTargetIndex]}`);
  
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end(`Proxy error: ${err.message}`);
});

// Create the server
const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  console.log(`Proxying request to ${targets[currentTargetIndex]}${req.url}`);
  
  // Forward the request
  proxy.web(req, res, {
    target: targets[currentTargetIndex],
    changeOrigin: true
  });
});

// Start the proxy server on port 3002
const PORT = 3002;
server.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Forwarding requests to ${targets[currentTargetIndex]}`);
  console.log('Access the API via http://localhost:3002/health');
}); 