export function loadVendorThree(url = '/assets/vendor-three-Cppjh5mf.js') {
  if (typeof window === 'undefined') return Promise.resolve();
  if ((window as any).__threeVendorLoaded) return Promise.resolve();

  return new Promise<void>((resolve, reject) => {
    try {
      const existing = document.querySelector(`script[src="${url}"]`);
      if (existing) {
        (window as any).__threeVendorLoaded = true;
        resolve();
        return;
      }

      const s = document.createElement('script');
      s.src = url;
      s.defer = true;
      s.onload = () => {
        (window as any).__threeVendorLoaded = true;
        window.dispatchEvent(new Event('threejs-loaded'));
        resolve();
      };
      s.onerror = (e) => reject(e);
      document.body.appendChild(s);
    } catch (err) {
      reject(err);
    }
  });
}
