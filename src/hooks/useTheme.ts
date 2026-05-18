import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

function canUseDOM() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function readStoredTheme(): Theme {
  if (!canUseDOM()) return 'light';

  try {
    const saved = window.localStorage.getItem('theme');
    return saved === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function storeTheme(theme: Theme) {
  try {
    window.localStorage.setItem('theme', theme);
  } catch {
    // localStorage can be unavailable in private browsing or hardened contexts.
  }
}

function applyTheme(theme: Theme) {
  if (!canUseDOM()) return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

function getInitialTheme(): Theme {
  return readStoredTheme();
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  // Vite SPA has no SSR — the component is always mounted client-side.
  // No useEffect needed to set mounted; derive it from window availability.
  const mounted = canUseDOM();

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      storeTheme(newTheme);
      applyTheme(newTheme);

      if (canUseDOM()) {
        document.body.style.transition = 'background-color 0.5s ease';
      }

      return newTheme;
    });
  }, []);

  const setThemeValue = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    storeTheme(newTheme);
    applyTheme(newTheme);
  }, []);

  return {
    theme,
    toggleTheme,
    setTheme: setThemeValue,
    mounted,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
}
