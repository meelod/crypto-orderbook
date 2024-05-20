// Skeleton for API calls

// Orderbook API
export const getOrderbook = async (asset: string) => {
    const response = await fetch(`/orderbook/${asset}`);
    if (!response.ok) {
      throw new Error('Failed to fetch orderbook data');
    }
    return response.json();
  };

// Trade API
export const sendTrade = async (order: { asset: string, side: 'BUY' | 'SELL', type: 'LIMIT' | 'MARKET', quantity: number, price?: number, notional: number }) => {
    try {
        console.log('sending trade request:', order);
        const response = await fetch('http://localhost:3000/trade/', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        });
        if (!response.ok) {
            throw new Error('Failed to place order from API');
        }
        const data = await response.json();
        console.log('trade response:', data);
        return data;
    } catch (error) {
        console.error('Error placing order:', error);
        return null;
    }
  };
  