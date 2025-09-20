import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('test main', () => {
  test('screen should contain Learn React', () => {
    render(<App />);
    const linkElement = screen.getByText(/Learn React/i);
    expect(linkElement).toBeInTheDocument();
  });
});