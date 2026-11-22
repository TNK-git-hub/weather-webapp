import './theme-toggle.css';

const ThemeToggle = ({ theme, onToggle }) => {
  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      className="navbar-icon-btn theme-toggle"
      aria-label={label}
      aria-pressed={isDark}
      onClick={onToggle}
    >
      <svg
        className="theme-toggle-icon"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        {isDark ? (
          <>
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : (
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        )}
      </svg>
    </button>
  );
};

export default ThemeToggle;
