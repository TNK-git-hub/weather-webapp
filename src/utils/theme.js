import { useCallback, useEffect, useState } from 'react';

export const THEME_STORAGE_KEY = 'atmoslens-theme';

export const isValidTheme = (value) => value === 'light' || value === 'dark';

export const readSavedTheme = () => {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isValidTheme(saved) ? saved : null;
  } catch {
    return null;
  }
};

export const saveTheme = (theme) => {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage unavailable (private mode, blocked site data): keep the in-memory theme only.
  }
};

const DARK_QUERY = '(prefers-color-scheme: dark)';

export const getSystemTheme = () => {
  try {
    if (typeof window.matchMedia !== 'function') {
      return 'light';
    }
    return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

export const resolveInitialTheme = () => readSavedTheme() ?? getSystemTheme();

export const useTheme = () => {
  const [theme, setTheme] = useState(resolveInitialTheme);
  const [explicit, setExplicit] = useState(() => readSavedTheme() !== null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (explicit || typeof window.matchMedia !== 'function') {
      return undefined;
    }
    let query;
    try {
      query = window.matchMedia(DARK_QUERY);
    } catch {
      return undefined;
    }
    const handleChange = (event) => setTheme(event.matches ? 'dark' : 'light');
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', handleChange);
      return () => query.removeEventListener('change', handleChange);
    }
    if (typeof query.addListener === 'function') {
      query.addListener(handleChange);
      return () => query.removeListener(handleChange);
    }
    return undefined;
  }, [explicit]);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setExplicit(true);
    setTheme(next);
    saveTheme(next);
  }, [theme]);

  return { theme, toggleTheme };
};
