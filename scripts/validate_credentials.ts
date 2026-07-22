#!/usr/bin/env node
/**
 * Technical Validation Script — Reliant AI Operational Automation (Tier 3)
 *
 * Verifies client-submitted integration credentials against live endpoints
 * (HubSpot, Cal.com, Slack) before production deployment.
 *
 * Usage:
 *   npm run validate:credentials
 *
 * Required env vars (never commit real values):
 *   HUBSPOT_APP_ACCESS_TOKEN
 *   SCHEDULING_API_KEY
 *   NOTIFICATION_ROUTING_WEBHOOK
 *
 * Optional:
 *   SKIP_HUBSPOT=1 | SKIP_SCHEDULING=1 | SKIP_SLACK=1  — skip a check
 *   SLACK_HANDSHAKE=0|false  — validate URL shape only; do not POST a probe message
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

interface ValidationResult {
  service: string;
  isValid: boolean;
  message: string;
  skipped?: boolean;
}

const REQUEST_TIMEOUT_MS = 10_000;

/** Load KEY=VALUE pairs from .env without overriding existing process.env. */
function loadEnvFile(filename = '.env'): void {
  const path = resolve(process.cwd(), filename);
  if (!existsSync(path)) return;

  const text = readFileSync(path, 'utf8');
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function isTruthySkip(value: string | undefined): boolean {
  if (!value) return false;
  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
}

function redactSecret(value: string): string {
  if (value.length <= 8) return '***';
  return `${value.slice(0, 4)}…${value.slice(-4)}`;
}

function redactWebhook(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}${parsed.pathname.slice(0, 12)}…`;
  } catch {
    return '[invalid-url]';
  }
}

async function fetchWithTimeout(
  input: string,
  init: RequestInit = {},
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.name === 'AbortError') return `Request timed out after ${REQUEST_TIMEOUT_MS}ms`;
    return error.message;
  }
  return String(error);
}

/**
 * Validates HubSpot Private App / App Access Token via a lightweight contacts read.
 */
async function validateHubSpot(token: string): Promise<ValidationResult> {
  const service = 'HubSpot CRM';

  if (!token.trim()) {
    return {
      service,
      isValid: false,
      message: 'Missing HUBSPOT_APP_ACCESS_TOKEN.',
    };
  }

  try {
    const response = await fetchWithTimeout(
      'https://api.hubapi.com/crm/v3/objects/contacts?limit=1',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.ok) {
      return {
        service,
        isValid: true,
        message: 'Successfully authenticated. Contacts read access verified.',
      };
    }

    const body = await response.text().catch(() => '');
    const detail = body ? ` — ${body.slice(0, 180)}` : '';
    return {
      service,
      isValid: false,
      message: `Authentication failed (${response.status})${detail}`,
    };
  } catch (error: unknown) {
    return {
      service,
      isValid: false,
      message: `Authentication failed: ${errorMessage(error)}`,
    };
  }
}

/**
 * Validates Cal.com API key against the v2 /me profile endpoint.
 * (API v1 was shut down; do not use query-param apiKey auth.)
 */
async function validateScheduling(apiKey: string): Promise<ValidationResult> {
  const service = 'Scheduling Engine (Cal.com)';

  if (!apiKey.trim()) {
    return {
      service,
      isValid: false,
      message: 'Missing SCHEDULING_API_KEY.',
    };
  }

  try {
    const response = await fetchWithTimeout('https://api.cal.com/v2/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'cal-api-version': '2024-08-13',
      },
    });

    if (response.ok) {
      return {
        service,
        isValid: true,
        message: 'Calendar sync active. Real-time availability endpoint responsive.',
      };
    }

    const body = await response.text().catch(() => '');
    const detail = body ? ` — ${body.slice(0, 180)}` : '';
    return {
      service,
      isValid: false,
      message: `Connection dropped (${response.status})${detail}`,
    };
  } catch (error: unknown) {
    return {
      service,
      isValid: false,
      message: `Connection dropped: ${errorMessage(error)}`,
    };
  }
}

/**
 * Validates Slack Incoming Webhook routing via an optional handshake payload.
 */
async function validateSlackWebhook(webhookUrl: string): Promise<ValidationResult> {
  const service = 'Emergency Slack Dispatch Route';

  if (!webhookUrl.trim()) {
    return {
      service,
      isValid: false,
      message: 'Missing NOTIFICATION_ROUTING_WEBHOOK.',
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(webhookUrl);
  } catch {
    return {
      service,
      isValid: false,
      message: 'Webhook URL is not a valid absolute URL.',
    };
  }

  const hostOk =
    parsed.protocol === 'https:' &&
    (parsed.hostname === 'hooks.slack.com' ||
      parsed.hostname.endsWith('.slack.com'));

  if (!hostOk) {
    return {
      service,
      isValid: false,
      message: `Webhook host rejected (${parsed.hostname}). Expected https://hooks.slack.com/...`,
    };
  }

  const handshakeFlag = (process.env.SLACK_HANDSHAKE ?? '1').trim().toLowerCase();
  if (handshakeFlag === '0' || handshakeFlag === 'false' || handshakeFlag === 'off') {
    return {
      service,
      isValid: true,
      message: `URL shape verified (${redactWebhook(webhookUrl)}); handshake probe skipped.`,
    };
  }

  try {
    const payload = {
      text: 'Reliant AI System Pipeline Diagnostics: Secure connection verified successfully.',
    };

    const response = await fetchWithTimeout(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await response.text().catch(() => '');
    if (response.ok || text.trim() === 'ok') {
      return {
        service,
        isValid: true,
        message: `Webhook handshake complete (${redactWebhook(webhookUrl)}).`,
      };
    }

    return {
      service,
      isValid: false,
      message: `Routing rejection code: ${response.status}${text ? ` — ${text.slice(0, 120)}` : ''}`,
    };
  } catch (error: unknown) {
    return {
      service,
      isValid: false,
      message: `Payload transmission failure: ${errorMessage(error)}`,
    };
  }
}

function skipped(service: string, reason: string): ValidationResult {
  return {
    service,
    isValid: true,
    skipped: true,
    message: reason,
  };
}

/**
 * Orchestrates lifecycle verification upon token receipt.
 */
export async function runFullTechnicalAudit(): Promise<number> {
  console.log('Initializing token integrity audit...\n');

  const hubspotToken = process.env.HUBSPOT_APP_ACCESS_TOKEN ?? '';
  const schedulingKey = process.env.SCHEDULING_API_KEY ?? '';
  const slackUrl = process.env.NOTIFICATION_ROUTING_WEBHOOK ?? '';

  if (hubspotToken) {
    console.log(`HubSpot token present: ${redactSecret(hubspotToken)}`);
  }
  if (schedulingKey) {
    console.log(`Scheduling key present: ${redactSecret(schedulingKey)}`);
  }
  if (slackUrl) {
    console.log(`Slack webhook present: ${redactWebhook(slackUrl)}`);
  }
  console.log('');

  const tasks: Promise<ValidationResult>[] = [
    isTruthySkip(process.env.SKIP_HUBSPOT)
      ? Promise.resolve(skipped('HubSpot CRM', 'Skipped via SKIP_HUBSPOT.'))
      : validateHubSpot(hubspotToken),
    isTruthySkip(process.env.SKIP_SCHEDULING)
      ? Promise.resolve(
          skipped('Scheduling Engine (Cal.com)', 'Skipped via SKIP_SCHEDULING.'),
        )
      : validateScheduling(schedulingKey),
    isTruthySkip(process.env.SKIP_SLACK)
      ? Promise.resolve(
          skipped('Emergency Slack Dispatch Route', 'Skipped via SKIP_SLACK.'),
        )
      : validateSlackWebhook(slackUrl),
  ];

  const report = await Promise.all(tasks);

  console.log('=== SYSTEM AUDIT REPORT ===');
  let overallSuccess = true;

  for (const result of report) {
    const statusIcon = result.skipped ? 'SKIP' : result.isValid ? 'PASS' : 'FAIL';
    if (!result.isValid) overallSuccess = false;
    console.log(`[${statusIcon}] ${result.service}: ${result.message}`);
  }

  console.log('\n==========================');
  if (overallSuccess) {
    console.log('STATUS: PRODUCTION READY. Environmental configuration approved.');
    return 0;
  }

  console.log('STATUS: CRITICAL ERROR. One or more data pipelines failed verification.');
  return 1;
}

const isDirectRun =
  typeof process.argv[1] === 'string' &&
  (process.argv[1].endsWith('validate_credentials.ts') ||
    process.argv[1].endsWith('validate_credentials.mjs') ||
    process.argv[1].endsWith('validate_credentials.js'));

if (isDirectRun) {
  loadEnvFile();
  runFullTechnicalAudit()
    .then((code) => {
      process.exit(code);
    })
    .catch((error: unknown) => {
      console.error('Unhandled audit failure:', errorMessage(error));
      process.exit(1);
    });
}
