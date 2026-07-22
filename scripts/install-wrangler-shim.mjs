#!/usr/bin/env node
/**
 * Install a wrangler bin shim used by Cloudflare Workers Builds.
 *
 * PR builds default to `wrangler versions upload`, which fails until the
 * Worker has been created once with `wrangler deploy`. On Workers CI, if
 * versions upload fails for that reason, fall back to deploy so the check
 * can succeed and initialize the Worker.
 */
import { copyFileSync, existsSync, writeFileSync, chmodSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const binPath = path.join(root, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
const upstreamPath = path.join(root, 'node_modules', 'wrangler', 'bin', 'wrangler.js.upstream');
const marker = 'reliantai-wrangler-bootstrap-shim';

if (!existsSync(binPath)) {
  process.exit(0);
}

const current = readFileSync(binPath, 'utf8');
if (current.includes(marker)) {
  process.exit(0);
}

if (!existsSync(upstreamPath)) {
  copyFileSync(binPath, upstreamPath);
}

const shim = `#!/usr/bin/env node
// ${marker}
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const binDir = __dirname;
const root = path.resolve(binDir, "..", "..", "..");
const cli = path.join(binDir, "..", "wrangler-dist", "cli.js");
const distIndex = path.join(root, "dist", "index.html");
const args = process.argv.slice(2);
const isWorkersCi = process.env.WORKERS_CI === "1";
const isVersionsUpload = args[0] === "versions" && args[1] === "upload";

function ensureDist() {
  if (fs.existsSync(distIndex)) return 0;
  console.log("[wrangler-shim] dist/ missing — running npm run build");
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  const build = spawnSync(npm, ["run", "build"], {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  });
  return build.status ?? 1;
}

function runWrangler(wranglerArgs, inherit) {
  return spawnSync(
    process.execPath,
    ["--no-warnings", cli, ...wranglerArgs],
    {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: inherit ? "inherit" : ["inherit", "pipe", "pipe"],
      env: process.env,
    }
  );
}

if (ensureDist() !== 0) {
  process.exit(1);
}

if (isWorkersCi && isVersionsUpload) {
  console.log("[wrangler-shim] Workers CI versions upload — trying preview upload first");
  const preview = runWrangler(args, false);
  if (preview.stdout) process.stdout.write(preview.stdout);
  if (preview.stderr) process.stderr.write(preview.stderr);

  const output = \`\${preview.stdout || ""}\${preview.stderr || ""}\`;
  const needsBootstrap = /does not yet exist/i.test(output);

  if ((preview.status ?? 1) === 0) {
    process.exit(0);
  }

  if (needsBootstrap) {
    console.log(
      "[wrangler-shim] Worker has no initial deployment — falling back to wrangler deploy to bootstrap"
    );
    // Keep any extra flags after "versions upload" (for example --env).
    const deploy = runWrangler(["deploy", ...args.slice(2)], true);
    process.exit(deploy.status ?? 1);
  }

  process.exit(preview.status ?? 1);
}

const passthrough = runWrangler(args, true);
process.exit(passthrough.status ?? 1);
`;

writeFileSync(binPath, shim, 'utf8');
chmodSync(binPath, 0o755);
console.log('[workers-ci] Installed wrangler bootstrap shim for Workers Builds.');
