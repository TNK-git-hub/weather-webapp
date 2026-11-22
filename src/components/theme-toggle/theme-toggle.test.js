import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from './theme-toggle';

describe('ThemeToggle', () => {
  test('TC-10: in light theme it offers dark mode, is not pressed, and click calls onToggle once', () => {
    const onToggle = jest.fn();
    render(<ThemeToggle theme="light" onToggle={onToggle} />);

    const button = screen.getByRole('button', { name: 'Switch to dark mode' });
    expect(button).toHaveAttribute('aria-pressed', 'false');

    userEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  test('TC-11: in dark theme it offers light mode and is pressed', () => {
    render(<ThemeToggle theme="dark" onToggle={jest.fn()} />);

    const button = screen.getByRole('button', { name: 'Switch to light mode' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  test('TC-12: Tab focuses the button and Enter then Space call onToggle exactly twice', () => {
    const onToggle = jest.fn();
    render(<ThemeToggle theme="light" onToggle={onToggle} />);

    userEvent.tab();
    const button = screen.getByRole('button', { name: 'Switch to dark mode' });
    expect(button).toHaveFocus();

    userEvent.keyboard('{enter}');
    userEvent.keyboard('{space}');
    expect(onToggle).toHaveBeenCalledTimes(2);
  });
});
