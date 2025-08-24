import { render, screen } from '@testing-library/react';
import { HelloMono } from '../components/HelloMono';

test('renders learn react link', () => {
  render(<HelloMono />);
  const linkElement = screen.getByText(/Learn react/i);
  expect(linkElement).toBeInTheDocument();
});
