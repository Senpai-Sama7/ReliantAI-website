import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

const PLACEHOLDER_KEYS = new Set(["", "your_key_here", "undefined", "null"])

function isWeb3FormsKeyMissing(): boolean {
  const key = process.env.VITE_WEB3FORMS_KEY?.trim() ?? ""
  return PLACEHOLDER_KEYS.has(key)
}

/**
 * Fail real production deploys when the contact form key is missing.
 * Do not gate generic GitHub Actions / PR verification builds on CI=true —
 * those runs often lack deploy secrets and would fail install/postinstall.
 */
function requireWeb3FormsKey(): Plugin {
  return {
    name: "require-web3forms-key",
    configResolved(config) {
      if (config.command !== "build") return
      if (!isWeb3FormsKeyMissing()) return

      const onVercelProduction =
        (process.env.VERCEL === "1" || process.env.VERCEL === "true") &&
        process.env.VERCEL_ENV === "production"
      const enforce =
        process.env.ENFORCE_WEB3FORMS === "1" || onVercelProduction

      if (enforce) {
        throw new Error(
          "VITE_WEB3FORMS_KEY must be set for production deploys (contact form is dead without it)."
        )
      }

      const hostedPreview =
        process.env.VERCEL === "1" ||
        process.env.VERCEL === "true" ||
        process.env.WORKERS_CI === "1" ||
        process.env.CF_PAGES === "1"
      if (hostedPreview || process.env.CI === "true" || process.env.CI === "1") {
        console.warn(
          "[web3forms] VITE_WEB3FORMS_KEY is missing — contact form will be disabled in this build. Set it for Vercel production (and Cloudflare) before shipping."
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
