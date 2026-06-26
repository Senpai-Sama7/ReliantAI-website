import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import fs from "fs"

// Serve static portfolio HTML files before SPA fallback
function portfolioPlugin() {
  return {
    name: 'portfolio-static',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';
        if (url.startsWith('/portfolio/') && url.endsWith('/')) {
          const filePath = path.join(__dirname, 'public', url, 'index.html');
          if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'text/html');
            res.end(fs.readFileSync(filePath));
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), portfolioPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const moduleId = id.replace(/\\/g, '/');

          if (moduleId.includes('vite/preload-helper')) {
            return 'vendor-runtime';
          }

          if (!moduleId.includes('/node_modules/')) return;

          if (
            moduleId.includes('/node_modules/react/') ||
            moduleId.includes('/node_modules/react-dom/') ||
            moduleId.includes('/node_modules/scheduler/')
          ) {
            return 'vendor-react';
          }

          if (
            moduleId.includes('/node_modules/three/') ||
            moduleId.includes('/node_modules/@react-three/') ||
            moduleId.includes('/node_modules/@pmndrs/')
          ) {
            return 'vendor-three';
          }

          if (moduleId.includes('/node_modules/gsap/')) {
            return 'vendor-gsap';
          }

          if (moduleId.includes('/node_modules/@radix-ui/')) {
            return 'vendor-ui';
          }
        },
      },
    },
  },
})
