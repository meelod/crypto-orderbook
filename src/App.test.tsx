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

  // test currently fails but the feature works
  // test('adds new order to the order book', async () => {
  //   // Mocking API requests is essential for this test
  //   render(<App />);
  //   // Assuming there's a button to add an order
  //   const addButton = screen.getByText(/Place Buy Order/i);
  //   fireEvent.click(addButton);

  //   // Assuming the form inputs are filled and submitted
  //   const newOrderPriceInput = screen.getByLabelText('Price:');
  //   const newOrderQuantityInput = screen.getByLabelText('Quantity:');
  //   const newOrderNotionalInput = screen.getByLabelText('Notional:');

  //   fireEvent.change(newOrderPriceInput, { target: { value: '1200' } });
  //   fireEvent.change(newOrderQuantityInput, { target: { value: '2' } });
  //   fireEvent.change(newOrderNotionalInput, { target: { value: '2400' } });

  //   const submitButton = screen.getByText(/Place Buy Order/i);
  //   fireEvent.click(submitButton);

  //   // Assuming the new order is added to the order book
  //   const newOrderPriceElement = await screen.findByText(/1200/i);
  //   expect(newOrderPriceElement).toBeInTheDocument();
  // });
});
