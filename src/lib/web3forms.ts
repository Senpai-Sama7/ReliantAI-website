const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

export async function submitToWeb3Forms(data: Record<string, string>): Promise<void> {
  if (!WEB3FORMS_KEY) throw new Error('VITE_WEB3FORMS_KEY environment variable is not set');
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_key: WEB3FORMS_KEY, ...data }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Form submission failed: ${res.status}${text ? ` — ${text}` : ''}`);
  }
}
