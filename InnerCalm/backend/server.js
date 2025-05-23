import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import fetch from 'node-fetch';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());

// Laravel API proxy with error handling
const laravelApiProxy = createProxyMiddleware({
  target: 'http://localhost:8000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api', // keep the /api prefix when forwarding
  },
  onProxyRes: (proxyRes, req, res) => {
    // Add CORS headers to the proxied response if needed
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    
    console.log(`[PROXY] ${req.method} ${req.path} => ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error(`[PROXY ERROR] ${req.method} ${req.path}:`, err.message);
    res.status(502).json({ 
      status: 'error', 
      message: 'Proxy Error. The Laravel backend appears to be unavailable.',
      details: err.message
    });
  }
});

// Proxy all API requests to Laravel
app.use('/api', laravelApiProxy);

// Serve static files from uploads if needed
app.use('/uploads', express.static('uploads'));

// Health check route that includes Laravel connection status
app.get('/health', async (req, res) => {
  try {
    // Try to connect to Laravel backend
    const response = await fetch('http://localhost:8000/api/health', {
      timeout: 3000
    }).then(r => r.json());
    res.status(200).json({ 
      status: 'Proxy server is running', 
      backend: 'connected',
      laravel_status: response 
    });
  } catch (error) {
    res.status(200).json({ 
      status: 'Proxy server is running', 
      backend: 'disconnected',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Proxying API requests to Laravel at http://localhost:8000`);
}); 