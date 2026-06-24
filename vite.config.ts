import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// @ts-ignore - plain JS helper shared with the Vercel serverless function
import { fetchSnapProfile } from './api/_snap.js';

// Dev-only middleware so `/api/profile` works under `vite dev` exactly like the
// Vercel serverless function does in production.
function snapProfileApi() {
  return {
    name: 'snap-profile-api',
    configureServer(server: any) {
      server.middlewares.use('/api/profile', async (req: any, res: any) => {
        const url = new URL(req.url || '', 'http://localhost');
        const username = url.searchParams.get('username') || '';
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        try {
          const profile = await fetchSnapProfile(username);
          res.end(JSON.stringify(profile));
        } catch (e: any) {
          res.end(JSON.stringify({ found: false, reason: 'error', message: String((e && e.message) || e) }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), snapProfileApi()],
  build: {
    outDir: 'dist',
  },
});
