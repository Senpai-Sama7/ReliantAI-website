import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  base: './',
  plugins: [react()],
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
