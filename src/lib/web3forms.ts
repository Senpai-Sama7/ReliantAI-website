const RAW_KEY = (import.meta.env.VITE_WEB3FORMS_KEY as string | undefined)?.trim() ?? '';
const PLACEHOLDER_KEYS = new Set(['', 'your_key_here', 'undefined', 'null']);

/** Resolved once at build time so Vite can tree-shake the submit fetch when unset. */
const WEB3FORMS_KEY = PLACEHOLDER_KEYS.has(RAW_KEY) ? '' : RAW_KEY;
const WEB3FORMS_CONFIGURED = WEB3FORMS_KEY.length > 0;

/** True when a real Web3Forms access key is present at build time. */
export function isWeb3FormsConfigured(): boolean {
  return WEB3FORMS_CONFIGURED;
}

export class Web3FormsConfigError extends Error {
  constructor(message = 'Form backend is not configured. Please call or email us directly.') {
    super(message);
    this.name = 'Web3FormsConfigError';
  }
}

type Web3FormsResponse = {
  success?: boolean;
  message?: string;
};

/**
 * Submits a lead payload to Web3Forms.
 * Throws Web3FormsConfigError when the Vite env key was never baked into the build.
 */
export async function submitToWeb3Forms(data: Record<string, string>): Promise<void> {
  if (!WEB3FORMS_CONFIGURED) {
    throw new Web3FormsConfigError();
  }

  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_key: WEB3FORMS_KEY, ...data }),
  });

  let payload: Web3FormsResponse | null = null;
  try {
    payload = (await res.json()) as Web3FormsResponse;
  } catch {
    payload = null;
  }

  if (!res.ok || payload?.success === false) {
    const detail = payload?.message?.trim();
    throw new Error(
      detail
        ? `Form submission failed: ${detail}`
        : `Form submission failed: ${res.status}${res.statusText ? ` ${res.statusText}` : ''}`,
    );
  }
}
