/** Verbose telegraphy logging for scroll stories, zones, and recovery. */

export type TelemetryLevel = 'debug' | 'info' | 'warn' | 'error';

export interface TelemetryEvent {
  ts: string;
  level: TelemetryLevel;
  channel: string;
  message: string;
  data?: Record<string, unknown>;
}

const LEVEL_ORDER: Record<TelemetryLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const MAX_BUFFER = 200;
const buffer: TelemetryEvent[] = [];

function resolveMinLevel(): TelemetryLevel {
  if (typeof window === 'undefined') return 'warn';
  try {
    const stored = window.localStorage.getItem('reliant-telemetry');
    if (stored === 'verbose' || stored === 'debug') return 'debug';
    if (stored === 'info') return 'info';
    if (stored === 'silent') return 'error';
  } catch {
    /* ignore */
  }
  return import.meta.env.DEV ? 'debug' : 'info';
}

let minLevel = resolveMinLevel();

export function setTelemetryLevel(level: TelemetryLevel | 'verbose' | 'silent'): void {
  if (level === 'verbose') minLevel = 'debug';
  else if (level === 'silent') minLevel = 'error';
  else minLevel = level;
}

export function getTelemetryBuffer(): readonly TelemetryEvent[] {
  return buffer;
}

function shouldLog(level: TelemetryLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[minLevel];
}

function push(event: TelemetryEvent): void {
  buffer.push(event);
  if (buffer.length > MAX_BUFFER) buffer.shift();
}

function consoleEmit(event: TelemetryEvent): void {
  const prefix = `[${event.channel}] ${event.message}`;
  const payload = event.data ?? {};
  switch (event.level) {
    case 'debug':
      console.debug(prefix, payload);
      break;
    case 'info':
      console.info(prefix, payload);
      break;
    case 'warn':
      console.warn(prefix, payload);
      break;
    case 'error':
      console.error(prefix, payload);
      break;
  }
}

export function telegraph(
  channel: string,
  message: string,
  data?: Record<string, unknown>,
  level: TelemetryLevel = 'info'
): void {
  const event: TelemetryEvent = {
    ts: new Date().toISOString(),
    level,
    channel,
    message,
    data,
  };
  push(event);
  if (shouldLog(level)) consoleEmit(event);
}

export function telegraphScrollStory(
  storyId: string,
  beat: string,
  data?: Record<string, unknown>
): void {
  telegraph('scroll-story', `${storyId} · ${beat}`, data, 'debug');
}

export function telegraphZone(from: string, to: string, source: string): void {
  telegraph('zone', `${from} → ${to}`, { source }, 'info');
}

export function telegraphRecovery(action: string, data?: Record<string, unknown>): void {
  telegraph('recovery', action, data, 'warn');
}

export function telegraphPerf(label: string, durationMs: number): void {
  telegraph('perf', label, { durationMs: Math.round(durationMs * 100) / 100 }, 'debug');
}

export function installGlobalTelemetry(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    telegraph('runtime', 'uncaught error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
    }, 'error');
  });

  window.addEventListener('unhandledrejection', (event) => {
    telegraph('runtime', 'unhandled rejection', {
      reason: String(event.reason),
    }, 'error');
  });

  telegraph('boot', 'telemetry online', { minLevel }, 'debug');
}

declare global {
  interface Window {
    __reliantTelemetry?: {
      buffer: () => readonly TelemetryEvent[];
      setLevel: (level: TelemetryLevel | 'verbose' | 'silent') => void;
    };
  }
}

export function exposeTelemetryDebug(): void {
  if (typeof window === 'undefined') return;
  window.__reliantTelemetry = {
    buffer: getTelemetryBuffer,
    setLevel: setTelemetryLevel,
  };
}
