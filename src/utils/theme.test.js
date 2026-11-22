import { act, renderHook } from '@testing-library/react';
import {
  getSystemTheme,
  readSavedTheme,
  resolveInitialTheme,
  saveTheme,
  THEME_STORAGE_KEY,
  useTheme,
} from './theme';

const mockMatchMedia = (prefersDark) => {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: query === '(prefers-color-scheme: dark)' ? prefersDark : false,
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
};

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  document.documentElement.removeAttribute('data-theme');
  delete window.matchMedia;
  jest.restoreAllMocks();
  localStorage.clear();
});

test('TC-01: resolves dark when nothing saved and OS prefers dark', () => {
  mockMatchMedia(true);
  expect(resolveInitialTheme()).toBe('dark');
});

test('TC-02: resolves light when nothing saved and OS prefers light', () => {
  mockMatchMedia(false);
  expect(resolveInitialTheme()).toBe('light');
});

test('TC-03: falls back to light without throwing when matchMedia is unavailable', () => {
  delete window.matchMedia;
  expect(window.matchMedia).toBeUndefined();
  expect(() => getSystemTheme()).not.toThrow();
  expect(getSystemTheme()).toBe('light');
  expect(() => resolveInitialTheme()).not.toThrow();
  expect(resolveInitialTheme()).toBe('light');
});

test('TC-04: ignores an invalid saved value and uses the OS theme', () => {
  localStorage.setItem(THEME_STORAGE_KEY, 'blue');
  mockMatchMedia(true);
  expect(THEME_STORAGE_KEY).toBe('atmoslens-theme');
  expect(readSavedTheme()).toBeNull();
  expect(resolveInitialTheme()).toBe('dark');
});

test('TC-05: a saved theme wins over the OS theme', () => {
  localStorage.setItem(THEME_STORAGE_KEY, 'dark');
  mockMatchMedia(false);
  expect(resolveInitialTheme()).toBe('dark');
});

test('TC-06: storage errors never throw', () => {
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('storage blocked');
  });
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('storage blocked');
  });
  expect(() => readSavedTheme()).not.toThrow();
  expect(readSavedTheme()).toBeNull();
  expect(() => saveTheme('dark')).not.toThrow();
});

const mockMatchMediaWithChange = (prefersDark) => {
  const listeners = new Set();
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: query === '(prefers-color-scheme: dark)' ? prefersDark : false,
    media: query,
    addEventListener: (type, fn) => type === 'change' && listeners.add(fn),
    removeEventListener: (type, fn) => type === 'change' && listeners.delete(fn),
    addListener: (fn) => listeners.add(fn),
    removeListener: (fn) => listeners.delete(fn),
  }));
  return {
    fireChange: (matches) => {
      act(() => {
        listeners.forEach((fn) => fn({ matches, media: '(prefers-color-scheme: dark)' }));
      });
    },
  };
};

test('TC-06b: toggling still switches the theme when saving throws', () => {
  mockMatchMediaWithChange(false);
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('storage blocked');
  });
  const { result } = renderHook(() => useTheme());
  expect(result.current.theme).toBe('light');
  expect(() => {
    act(() => {
      result.current.toggleTheme();
    });
  }).not.toThrow();
  expect(result.current.theme).toBe('dark');
});

test('TC-07: follows OS change while no explicit choice and does not save', () => {
  const media = mockMatchMediaWithChange(false);
  const setItem = jest.spyOn(Storage.prototype, 'setItem');
  const { result } = renderHook(() => useTheme());
  expect(result.current.theme).toBe('light');
  media.fireChange(true);
  expect(result.current.theme).toBe('dark');
  expect(setItem).not.toHaveBeenCalled();
});

test('TC-08: an explicit choice is saved and stops following the OS', () => {
  const media = mockMatchMediaWithChange(false);
  const { result } = renderHook(() => useTheme());
  act(() => {
    result.current.toggleTheme();
  });
  expect(result.current.theme).toBe('dark');
  media.fireChange(false);
  expect(result.current.theme).toBe('dark');
  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
});

test('TC-09: applies the theme to the document root and updates it on toggle', () => {
  mockMatchMediaWithChange(true);
  const { result } = renderHook(() => useTheme());
  expect(document.documentElement.dataset.theme).toBe('dark');
  act(() => {
    result.current.toggleTheme();
  });
  expect(document.documentElement.dataset.theme).toBe('light');
});

test('Edge (spec 10): rapid toggling ends on the theme of the last click', () => {
  mockMatchMediaWithChange(false);
  const { result } = renderHook(() => useTheme());
  act(() => {
    result.current.toggleTheme();
  });
  act(() => {
    result.current.toggleTheme();
  });
  act(() => {
    result.current.toggleTheme();
  });
  expect(result.current.theme).toBe('dark');
  expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  expect(document.documentElement.dataset.theme).toBe('dark');
});

describe('theme-init script (public/index.html)', () => {
  const fs = require('fs');
  const path = require('path');

  const readIndexHtml = () =>
    fs.readFileSync(path.resolve(__dirname, '../../public/index.html'), 'utf8');

  const getThemeInitScript = () => {
    const match = readIndexHtml().match(/<script id="theme-init">([\s\S]*?)<\/script>/);
    if (!match) {
      throw new Error('Missing <script id="theme-init"> in public/index.html');
    }
    return match[1];
  };

  // eslint-disable-next-line no-new-func
  const runThemeInitScript = () => new Function(getThemeInitScript())();

  test('TC-17: applies dark before React when nothing is saved and OS prefers dark', () => {
    mockMatchMedia(true);
    runThemeInitScript();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  test('TC-17: the inline style has a dark background rule (BR-04)', () => {
    const style = readIndexHtml().match(/<style>([\s\S]*?)<\/style>/);
    expect(style).not.toBeNull();
    expect(style[1]).toMatch(/html\[data-theme="dark"\]\s+body\s*\{/);
  });

  test('TC-18a: a saved dark theme wins over an OS light preference', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    mockMatchMedia(false);
    runThemeInitScript();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  test('TC-18b: an invalid saved value falls back to the OS light theme', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'blue');
    mockMatchMedia(false);
    runThemeInitScript();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  test('TC-18c: a throwing storage does not throw and uses the OS dark theme', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });
    mockMatchMedia(true);
    expect(() => runThemeInitScript()).not.toThrow();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  test('TC-19: the script reads only the THEME_STORAGE_KEY key', () => {
    const code = getThemeInitScript();
    expect(code).toContain(`'${THEME_STORAGE_KEY}'`);
    const calls = code.match(/localStorage\.getItem\(([^)]*)\)/g) || [];
    expect(calls.length).toBeGreaterThan(0);
    calls.forEach((call) => {
      expect(call).toBe(`localStorage.getItem('${THEME_STORAGE_KEY}')`);
    });
  });
});
