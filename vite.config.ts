import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

const PLACEHOLDER_KEYS = new Set(["", "your_key_here", "undefined", "null"])

/** Fail hosted production builds when the contact form key was never provided. */
function requireWeb3FormsKey(): Plugin {
  return {
    name: "require-web3forms-key",
    configResolved(config) {
      if (config.command !== "build") return
      const enforce =
        process.env.VERCEL === "1" ||
        process.env.CI === "true" ||
        process.env.ENFORCE_WEB3FORMS === "1"
      if (!enforce) return

      const key = process.env.VITE_WEB3FORMS_KEY?.trim() ?? ""
      if (PLACEHOLDER_KEYS.has(key)) {
        throw new Error(
          "VITE_WEB3FORMS_KEY must be set for production CI builds (contact form is dead without it)."
        )
      }
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [react(), requireWeb3FormsKey()],
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
