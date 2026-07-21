#!/usr/bin/env node
/**
 * Workers Builds ignores wrangler.jsonc build.command.
 * When Cloudflare installs deps (WORKERS_CI=1), produce dist/ so the
 * subsequent `wrangler versions upload` / `wrangler deploy` can find assets.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(root, 'package.json'));

if (process.env.WORKERS_CI !== '1') {
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

console.log('[workers-ci] WORKERS_CI detected — preparing production assets for Cloudflare.');

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

if (!existsSync(path.join(root, 'dist', 'index.html'))) {
  console.error('[workers-ci] Build finished but dist/index.html is missing.');
  process.exit(1);
}

console.log('[workers-ci] dist/ ready for wrangler upload.');
