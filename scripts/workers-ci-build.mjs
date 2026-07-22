#!/usr/bin/env node
/**
 * Workers Builds ignores wrangler.jsonc `build.command` and may not set
 * WORKERS_CI during `npm ci`. When any non-Vercel CI install runs, produce
 * dist/ so the subsequent wrangler upload can find assets.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(root, 'package.json'));
const distIndex = path.join(root, 'dist', 'index.html');

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
const isWorkersCi = process.env.WORKERS_CI === '1';
const isCi =
  isWorkersCi ||
  process.env.CI === 'true' ||
  process.env.CI === '1' ||
  process.env.CF_PAGES === '1';

// GitHub Actions already runs `npm run build` explicitly — skip the
// postinstall Cloudflare asset build there (avoids double work + secret gates).
if (isVercel || isGitHubActions || !isCi) {
  process.exit(0);
}

if (existsSync(distIndex)) {
  console.log('[workers-ci] dist/ already present — skipping build.');
  process.exit(0);
}

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function run(cmd, args) {
  const result = spawnSync(cmd, args, {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log('[workers-ci] CI detected without dist/ — running production build for Cloudflare assets.');

let hasVite = false;
try {
  require.resolve('vite');
  hasVite = true;
} catch {
  hasVite = false;
}

if (!hasVite) {
  console.log('[workers-ci] vite missing from install — reinstalling with devDependencies.');
  run(npm, ['install', '--include=dev', '--no-fund', '--no-audit']);
}

run(npm, ['run', 'build']);

if (!existsSync(distIndex)) {
  console.error('[workers-ci] Build finished but dist/index.html is missing.');
  process.exit(1);
}

console.log('[workers-ci] dist/ ready for wrangler upload.');
