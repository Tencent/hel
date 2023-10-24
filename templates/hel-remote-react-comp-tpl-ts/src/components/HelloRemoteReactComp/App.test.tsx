import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn hel-micro link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Learn hel-micro/i);
  // TO BE FIXED: no toBeInTheDocument property in pnpm
  expect(linkElement).toBeInTheDocument();
});
