import React, { useState, useEffect, useRef } from 'react';
import './Orderbook.css';
import { getOrderbook } from './api/api';

// Define the Order interface
interface Order {
  price: string;
  quantity: string;
}

// Define the OrderbookData interface
interface OrderbookData {
  bids: Order[];
  asks: Order[];
}

// Define the OrderbookProps interface
interface OrderbookProps {
  asset: string;
  orders: any[];
}

const Orderbook: React.FC<OrderbookProps> = ({ asset , orders}) => {
  // Initialize the orderbook state
  const [orderbook, setOrderbook] = useState<OrderbookData>({ bids: [], asks: [] });
  // Create a reference for the asks list
  const asksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getOrderbook(asset) // Fetch the orderbook data from the API
      .then(data => {
        const formattedData = {
          bids: formatOrders(data.bids).reverse(), // Sorted from smallest to largest
          asks: formatOrders(data.asks).reverse(), // Sorted from smallest to largest
        };
        setOrderbook(formattedData); // Update the orderbook state
      })
      .catch(error => console.error('Error fetching orderbook:', error));
  }, [asset]);

  useEffect(() => {
    if (asksRef.current) { // Check if the asks list reference exists
      asksRef.current.scrollTop = asksRef.current.scrollHeight; // Scroll to the bottom of the asks list
    }
  }, [orderbook.asks]); // Trigger when the asks list changes

    // Update orderbook when orders change
    useEffect(() => {
        // Create copies of the current orderbook
        const updatedOrderbook = { ...orderbook };

        // Loop through the new orders
        orders.forEach((order: any) => {
        // Check the side of the order (BUY or SELL)
        const side = order.side.toUpperCase();

        // Check if the side exists in the orderbook
        if (side === 'BUY' && updatedOrderbook.bids) {
            // Add the new order to the bids
            updatedOrderbook.bids.push({ price: order.price.toString(), quantity: order.quantity.toString() });
        } else if (side === 'SELL' && updatedOrderbook.asks) {
            // Add the new order to the asks
            updatedOrderbook.asks.push({ price: order.price.toString(), quantity: order.quantity.toString() });
            updatedOrderbook.asks.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        }
        });

        // Update the orderbook state with the updated orderbook
        setOrderbook(updatedOrderbook);
    }, [orders]);
  


  // Format the orders to have price and quantity as strings
  const formatOrders = (orders: [string, string][]) => {
    return orders.map(([price, quantity]) => ({
      price: parseFloat(price).toString(),
      quantity: parseFloat(quantity).toString(),
    })).sort((a, b) => parseFloat(a.price) - parseFloat(b.price)); // Sort from smallest to largest
  };

  // Calculate the amount in USD based on the price and quantity to 2 decimal places
  const calculateAmountInUSD = (price: string, quantity: string): string => {
    const amount = parseFloat(price) * parseFloat(quantity);
    return amount.toFixed(2);
  };

  return (
    <div className="orderbook">
      <div className="orderbook-section">
        <h3>Asks</h3>
        <div className="order-header">
          <span>Price</span>
          <span>Quantity</span>
          <span>Amount in USD</span>
        </div>
        <div className="order-list asks-list" ref={asksRef}>
          {orderbook.asks.map((ask, index) => (
            <div key={index} className="order-item">
              <span>{ask.price}</span> <span>{ask.quantity}</span> <span>{calculateAmountInUSD(ask.price, ask.quantity)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="orderbook-section">
        <h3>Bids</h3>
        <div className="order-header">
          <span>Price</span>
          <span>Quantity</span>
          <span>Amount in USD</span>
        </div>
        <div className="order-list bids-list">
          {orderbook.bids.map((bid, index) => (
            <div key={index} className="order-item">
              <span>{bid.price}</span> <span>{bid.quantity}</span> <span>{calculateAmountInUSD(bid.price, bid.quantity)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orderbook;
