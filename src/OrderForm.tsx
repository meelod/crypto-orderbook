import React, { useState } from 'react';
import './OrderForm.css'; // Import the OrderForm styles
import { sendTrade } from './api/api';

interface OrderFormProps {
  asset: string;
  addOrder: (order: any) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ asset, addOrder }) => {
  const [quantity, setQuantity] = useState<number | string>('');
  const [price, setPrice] = useState<number | string>('');
  const [notional, setNotional] = useState<number | string>('');
  const [orderType, setOrderType] = useState<'LIMIT' | 'MARKET'>('LIMIT');
  const [message, setMessage] = useState<string>('');

  /* Handle the quantity change event */
  const handleQuantityChange = (value: string) => {
    setQuantity(value);
    if (orderType === 'LIMIT' && typeof value === 'string' && typeof price === 'string') {
      setNotional((parseFloat(value) * parseFloat(price)).toFixed(2));
    }
  };

  /* Handle the price change event */
  const handlePriceChange = (value: string) => {
    setPrice(value);
    if (typeof value === 'string' && typeof quantity === 'string') {
      setNotional((parseFloat(value) * parseFloat(quantity)).toFixed(2));
    }
  };

    /* Handle the notional change event */
  const handleNotionalChange = (value: string) => {
    setNotional(value);
    if (typeof value === 'string' && typeof quantity === 'string') {
      setPrice((parseFloat(value) / parseFloat(quantity)).toFixed(2));
    }
  };

    /* Handle orders */
  const handleOrderSubmit = async (side: 'BUY' | 'SELL') => {
    try {
      if (!quantity || !price || !notional) {
        throw new Error('Please fill in all required fields: Quantity, Price, and Notional.');
      }
  
      const order = {
        asset,
        side,
        type: orderType,
        quantity: typeof quantity === 'string' ? parseFloat(quantity) : quantity,
        price: orderType === 'LIMIT' ? (typeof price === 'string' ? parseFloat(price) : price) : undefined,
        notional: typeof notional === 'string' ? parseFloat(notional) : notional,
      };
  
      const response = await sendTrade(order); // Send the order to the API
      if (response && response.id) { // Check if the response contains an order id
        setMessage(`Order ${side} successfully placed with id: ${response.id}`);
        addOrder({ ...order, id: response.id }); // Add the order to the list
      } else { // Otherwise display an error message
        setMessage('Failed to place order from OrderForm component');
      }
    } catch (error) {
      setMessage('Order submission failed from OrderForm component');
    }
  };
  
  

  return (
    <div className="OrderForm">
      <h2>Order Form</h2>
      <div>
        <label>Quantity: </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => handleQuantityChange(e.target.value)}
        />
      </div>
      {orderType === 'LIMIT' && (
        <div>
          <label>Price: </label>
          <input
            type="number"
            value={price}
            onChange={(e) => handlePriceChange(e.target.value)}
          />
        </div>
      )}
      <div>
        <label>Notional: </label>
        <input
          type="number"
          value={notional}
          onChange={(e) => handleNotionalChange(e.target.value)}
        />
      </div>
      <div>
        <button onClick={() => handleOrderSubmit('BUY')}>Place Buy Order</button>
        <button onClick={() => handleOrderSubmit('SELL')}>Place Sell Order</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default OrderForm;
