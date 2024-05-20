import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders the App component', () => {
    render(<App />);
    const linkElement = screen.getByText(/Cryptocurrency Order Book/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('renders the Orderbook component', () => {
    render(<App />);
    const orderbookElement = screen.getByText(/Asks/i);
    expect(orderbookElement).toBeInTheDocument();
  });
});
