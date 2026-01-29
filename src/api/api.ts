import { TradeOrder, TradeResponse, OrderbookResponse } from '../types';

const API_BASE = 'http://localhost:3001';

/**
 * Fetch orderbook data for a specific asset
 */
export const getOrderbook = async (asset: string): Promise<OrderbookResponse> => {
  const response = await fetch(`/orderbook/${asset}`);
  if (!response.ok) {
    throw new Error('Failed to fetch orderbook data');
  }
  return response.json();
};

/**
 * Submit a trade order
 */
export const sendTrade = async (order: TradeOrder): Promise<TradeResponse | null> => {
  try {
    const response = await fetch(`${API_BASE}/trade/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to place order');
    }

    return response.json();
  } catch (error) {
    console.error('Error placing order:', error);
    return null;
  }
};
