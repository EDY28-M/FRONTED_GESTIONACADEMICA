// Servidor proxy CORS simple para desarrollo/producción
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://fronted-gestionacademica.onrender.com',
    'https://your-frontend-domain.com'
  ],
  credentials: true
}));

// Configurar proxy hacia tu backend
app.use('/api', createProxyMiddleware({
  target: 'http://34.60.233.211:8080',
  changeOrigin: true,
  secure: false,
  logLevel: 'debug',
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error occurred' });
  }
}));

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`CORS Proxy server running on port ${PORT}`);
  console.log(`Proxying requests to: http://34.60.233.211:8080`);
});
