#!/usr/bin/env node
/**
 * Extracts and validates every application/ld+json block in an HTML file.
 * Fails (exit 1) on malformed JSON or missing required Schema.org node types.
 *
 * Usage: node scripts/validate-jsonld.mjs <html-file>
 */
import { readFile } from 'node:fs/promises';

const file = process.argv[2];
if (!file) {
  console.error('validate-jsonld: missing HTML file argument');
  process.exit(1);
}

const html = await readFile(file, 'utf8');
const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];

if (blocks.length === 0) {
  console.error('validate-jsonld: no JSON-LD blocks found');
  process.exit(1);
}

const seenTypes = new Set();
let index = 0;

for (const [, raw] of blocks) {
  index += 1;
  let data;
  try {
    data = JSON.parse(raw.trim());
  } catch (err) {
    console.error(`validate-jsonld: block #${index} is not valid JSON -> ${err.message}`);
    process.exit(1);
  }
  const nodes = Array.isArray(data['@graph']) ? data['@graph'] : [data];
  for (const node of nodes) {
    const t = node['@type'];
    if (Array.isArray(t)) t.forEach((x) => seenTypes.add(x));
    else if (t) seenTypes.add(t);
  }
}

const required = ['Organization', 'WebSite', 'FAQPage', 'LocalBusiness', 'BreadcrumbList'];
const missing = required.filter((t) => !seenTypes.has(t));
if (missing.length > 0) {
  console.error(`validate-jsonld: missing expected Schema.org types: ${missing.join(', ')}`);
  console.error(`validate-jsonld: found types: ${[...seenTypes].sort().join(', ')}`);
  process.exit(1);
}

console.log(`validate-jsonld: OK (${blocks.length} block(s), types: ${[...seenTypes].sort().join(', ')})`);
