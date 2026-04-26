const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string;

export async function submitToWeb3Forms(data: Record<string, string>): Promise<void> {
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_key: WEB3FORMS_KEY, ...data }),
  });
  if (!res.ok) throw new Error('Form submission failed');
}
