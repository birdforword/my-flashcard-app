import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the 表示 button', () => {
  render(<App />);
  const button = screen.getByRole('button', { name: '表示' });
  expect(button).toBeInTheDocument();
});
