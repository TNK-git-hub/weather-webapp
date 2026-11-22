import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

jest.mock('./components/search/search', () => ({ onSearchChange }) => (
  <button
    type="button"
    onClick={() => onSearchChange({ value: '21.03 105.85', label: 'Hanoi, VN' })}
  >
    mock search
  </button>
));

const weatherFixture = {
  weather: [{ description: 'clear sky', icon: '01d' }],
  main: { temp: 30, feels_like: 32, temp_max: 31, temp_min: 29, humidity: 60, pressure: 1012 },
  wind: { speed: 2, deg: 90 },
};

const mockMatchMedia = (matches) => {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches,
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
};

describe('App', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    localStorage.clear();
    mockMatchMedia(false);
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    delete window.matchMedia;
    delete document.documentElement.dataset.theme;
    localStorage.clear();
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  test('TC-16: renders the AtmosLens heading on the landing page', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'AtmosLens' })).toBeInTheDocument();
  });

  test('TC-13: clicking the landing toggle switches the page to dark mode', () => {
    render(<App />);

    userEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }));

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument();
  });

  test('TC-14: the results page keeps the saved dark theme and shows the toggle', async () => {
    localStorage.setItem('atmoslens-theme', 'dark');
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ json: () => Promise.resolve(weatherFixture) })
      .mockResolvedValueOnce({ json: () => Promise.resolve({ list: [] }) });

    render(<App />);
    userEvent.click(screen.getByRole('button', { name: 'mock search' }));

    expect(await screen.findByRole('heading', { name: 'Hanoi' })).toBeInTheDocument();
    const toggle = screen.getByRole('button', { name: 'Switch to light mode' });
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });
});
