import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getOrderbook } from '../api/api';
import { Order, OrderbookData, OrderbookProps } from '../types';

const Orderbook: React.FC<OrderbookProps> = ({ asset, orders }) => {
  const [orderbook, setOrderbook] = useState<OrderbookData>({ bids: [], asks: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const asksRef = useRef<HTMLDivElement>(null);
  const prevOrdersLengthRef = useRef(0);

  // Fetch orderbook data
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    getOrderbook(asset)
      .then(data => {
        const formattedData: OrderbookData = {
          bids: formatOrders(data.bids).reverse(),
          asks: formatOrders(data.asks).reverse(),
        };
        setOrderbook(formattedData);
        setIsLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch orderbook');
        setIsLoading(false);
        console.error('Error fetching orderbook:', err);
      });
  }, [asset]);

  // Auto-scroll asks to bottom
  useEffect(() => {
    if (asksRef.current) {
      asksRef.current.scrollTop = asksRef.current.scrollHeight;
    }
  }, [orderbook.asks]);

  // Update orderbook with new orders
  useEffect(() => {
    if (orders.length === 0 || orders.length === prevOrdersLengthRef.current) return;
    
    prevOrdersLengthRef.current = orders.length;
    const latestOrder = orders[orders.length - 1];

    setOrderbook(prev => {
      if (latestOrder.side === 'BUY') {
        return {
          ...prev,
          bids: [
            ...prev.bids,
            { price: latestOrder.price?.toString() || '0', quantity: latestOrder.quantity.toString() }
          ]
        };
      } else {
        return {
          ...prev,
          asks: [
            ...prev.asks,
            { price: latestOrder.price?.toString() || '0', quantity: latestOrder.quantity.toString() }
          ].sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
        };
      }
    });
  }, [orders]);

  const formatOrders = (orders: [string, string][]): Order[] => {
    return orders
      .map(([price, quantity]) => ({
        price: parseFloat(price).toString(),
        quantity: parseFloat(quantity).toString(),
      }))
      .sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  };

  const calculateAmountInUSD = (price: string, quantity: string): string => {
    const amount = parseFloat(price) * parseFloat(quantity);
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatPrice = (price: string): string => {
    return parseFloat(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatQuantity = (quantity: string): string => {
    return parseFloat(quantity).toFixed(6);
  };

  // Calculate max quantity for depth visualization
  const maxAskQty = useMemo(() => 
    Math.max(...orderbook.asks.map(o => parseFloat(o.quantity)), 1), [orderbook.asks]);
  const maxBidQty = useMemo(() => 
    Math.max(...orderbook.bids.map(o => parseFloat(o.quantity)), 1), [orderbook.bids]);

  if (isLoading) {
    return (
      <div className="bg-terminal-card rounded-lg border border-terminal-border p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-400 border-t-transparent"></div>
          <span className="ml-3 text-gray-500 font-mono text-sm">Loading orderbook...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-terminal-card rounded-lg border border-red-900/50 p-8">
        <div className="text-center text-red-400 font-mono text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-terminal-card rounded-lg border border-terminal-border overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-terminal-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Order Book</h2>
        <span className="text-xs text-cyan-400 font-mono">{asset}/USD</span>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-3 px-4 py-2 bg-terminal-bg/50 text-xs font-mono text-gray-500 uppercase">
        <span>Price</span>
        <span className="text-center">Size</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (Sells) */}
      <div className="border-b border-terminal-border">
        <div 
          ref={asksRef}
          className="max-h-[220px] overflow-y-auto"
        >
          {orderbook.asks.map((ask, index) => {
            const depthPercent = (parseFloat(ask.quantity) / maxAskQty) * 100;
            return (
              <div 
                key={`ask-${index}`} 
                className="relative grid grid-cols-3 px-4 py-1 hover:bg-terminal-hover transition-colors"
              >
                {/* Depth bar */}
                <div 
                  className="absolute right-0 top-0 bottom-0 bg-rose-500/10"
                  style={{ width: `${depthPercent}%` }}
                />
                <span className="relative text-rose-400 font-mono text-xs">
                  {formatPrice(ask.price)}
                </span>
                <span className="relative text-center text-gray-400 font-mono text-xs">
                  {formatQuantity(ask.quantity)}
                </span>
                <span className="relative text-right text-gray-500 font-mono text-xs">
                  {calculateAmountInUSD(ask.price, ask.quantity)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spread */}
      <div className="px-4 py-2 bg-terminal-bg flex items-center justify-between border-b border-terminal-border">
        <span className="text-xs text-gray-600 font-mono">SPREAD</span>
        <span className="text-xs font-mono text-white">
          {orderbook.asks.length > 0 && orderbook.bids.length > 0
            ? `$${(parseFloat(orderbook.asks[orderbook.asks.length - 1]?.price || '0') - 
                parseFloat(orderbook.bids[0]?.price || '0')).toFixed(2)}`
            : '-'}
        </span>
      </div>

      {/* Bids (Buys) */}
      <div>
        <div className="max-h-[220px] overflow-y-auto">
          {orderbook.bids.map((bid, index) => {
            const depthPercent = (parseFloat(bid.quantity) / maxBidQty) * 100;
            return (
              <div 
                key={`bid-${index}`} 
                className="relative grid grid-cols-3 px-4 py-1 hover:bg-terminal-hover transition-colors"
              >
                {/* Depth bar */}
                <div 
                  className="absolute right-0 top-0 bottom-0 bg-emerald-500/10"
                  style={{ width: `${depthPercent}%` }}
                />
                <span className="relative text-emerald-400 font-mono text-xs">
                  {formatPrice(bid.price)}
                </span>
                <span className="relative text-center text-gray-400 font-mono text-xs">
                  {formatQuantity(bid.quantity)}
                </span>
                <span className="relative text-right text-gray-500 font-mono text-xs">
                  {calculateAmountInUSD(bid.price, bid.quantity)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Orderbook;
