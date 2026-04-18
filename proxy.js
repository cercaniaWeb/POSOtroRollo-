import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PROXY_PORT = 3000;       // Puerto público (el que compartes)
const VITE_PORT  = 5173;       // Puerto donde corre Vite

// ── Archivo de log ─────────────────────────────────────────────────────────
const LOG_FILE = path.join(__dirname, 'access.log');

function timestamp() {
  return new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
}

function logVisit(ip, method, url) {
  const line = `[${timestamp()}] ${method} ${url}  IP: ${ip}\n`;
  // Consola
  process.stdout.write(line);
  // Archivo
  fs.appendFileSync(LOG_FILE, line);
}

// ── Middleware de logging ───────────────────────────────────────────────────
app.use((req, res, next) => {
  // Obtiene la IP real aunque haya NAT/proxy
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.socket.remoteAddress ||
    'desconocida';

  // Solo loguea la ruta principal, no cada asset (CSS, JS, imágenes)
  const isAsset = /\.(js|css|png|jpg|jpeg|svg|ico|woff2?|ttf|map)$/i.test(req.url);
  if (!isAsset) {
    logVisit(ip, req.method, req.url);
  }

  next();
});

// ── Proxy hacia Vite ────────────────────────────────────────────────────────
app.use(
  '/',
  createProxyMiddleware({
    target: `http://localhost:${VITE_PORT}`,
    changeOrigin: true,
    ws: true,          // WebSocket (HMR de Vite)
    on: {
      error: (err, req, res) => {
        console.error('❌ Error de proxy:', err.message);
        res.status(502).send('Servidor no disponible — asegúrate de que Vite esté corriendo.');
      },
    },
  })
);

// ── Arranque ────────────────────────────────────────────────────────────────
app.listen(PROXY_PORT, '0.0.0.0', () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🔁 Proxy corriendo en el puerto ${PROXY_PORT}`);
  console.log(`📡 Redirigiendo a Vite en puerto ${VITE_PORT}`);
  console.log(`📝 Log de accesos: access.log`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Comparte:  http://TU_IP_PUBLICA:3000');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});
