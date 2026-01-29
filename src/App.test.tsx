import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock the API
jest.mock('./api/api', () => ({
  getOrderbook: jest.fn(() => Promise.resolve({
    bids: [['50000', '1.5'], ['49999', '2.0']],
    asks: [['50001', '1.0'], ['50002', '0.5']]
  })),
  sendTrade: jest.fn(() => Promise.resolve({ id: 'test-id', timestamp: Date.now() }))
}));

describe('App Component', () => {
  test('renders the App component', () => {
    render(<App />);
    const headerElement = screen.getByText(/Crypto Orderbook/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('renders the Orderbook component', async () => {
    render(<App />);
    await waitFor(() => {
      const orderbookElement = screen.getByText(/Order Book/i);
      expect(orderbookElement).toBeInTheDocument();
    });
  });

  test('renders the OrderForm component', () => {
    render(<App />);
    const formElement = screen.getByText(/Place Order/i);
    expect(formElement).toBeInTheDocument();
  });

  test('renders asset selector with BTC/USD', () => {
    render(<App />);
    const selector = screen.getByRole('combobox');
    expect(selector).toBeInTheDocument();
    expect(selector).toHaveValue('BTC');
  });
});
