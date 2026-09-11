import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// In development the FastAPI server runs beside this one; both `/api` and the
// terminal WebSocket are proxied to it, so the UI code never knows two ports.
const server = 'http://127.0.0.1:8600'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, proxy: { '/api': server, '/ws': { target: server, ws: true } } },
})
