import React, { useState, useCallback, useMemo } from 'react';
import { sendTrade } from '../api/api';
import { OrderFormProps, OrderSide, OrderType, TradeResponse } from '../types';

const OrderForm: React.FC<OrderFormProps> = ({ asset, onOrderPlaced }) => {
  const [quantity, setQuantity] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [orderType, setOrderType] = useState<OrderType>('LIMIT');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Calculate notional value
  const notional = useMemo(() => {
    const qty = parseFloat(quantity) || 0;
    const prc = parseFloat(price) || 0;
    return qty * prc;
  }, [quantity, price]);

  const handleQuantityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setQuantity(value);
    }
  }, []);

  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPrice(value);
    }
  }, []);

  const validateOrder = (): string | null => {
    if (!quantity || parseFloat(quantity) <= 0) {
      return 'Enter a valid quantity';
    }
    if (orderType === 'LIMIT' && (!price || parseFloat(price) <= 0)) {
      return 'Enter a valid price';
    }
    if (notional <= 0) {
      return 'Order value must be > 0';
    }
    return null;
  };

  const handleSubmit = async (side: OrderSide) => {
    const validationError = validateOrder();
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const order = {
        asset,
        side,
        type: orderType,
        quantity: parseFloat(quantity),
        price: orderType === 'LIMIT' ? parseFloat(price) : undefined,
        notional,
      };

      const response = await sendTrade(order) as TradeResponse | null;
      
      if (response?.id) {
        setMessage({ type: 'success', text: `${side} order placed` });
        onOrderPlaced(response);
        setQuantity('');
        setPrice('');
      } else {
        setMessage({ type: 'error', text: 'Failed to place order' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Order submission failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearMessage = useCallback(() => {
    setMessage(null);
  }, []);

  return (
    <div className="bg-terminal-card rounded-lg border border-terminal-border overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-terminal-border">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Place Order</h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Order Type Toggle */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-terminal-bg rounded">
          <button
            onClick={() => setOrderType('LIMIT')}
            className={`py-2 px-3 rounded text-xs font-mono font-medium transition-all
              ${orderType === 'LIMIT' 
                ? 'bg-terminal-border text-white' 
                : 'text-gray-500 hover:text-gray-300'}`}
          >
            LIMIT
          </button>
          <button
            onClick={() => setOrderType('MARKET')}
            className={`py-2 px-3 rounded text-xs font-mono font-medium transition-all
              ${orderType === 'MARKET' 
                ? 'bg-terminal-border text-cyan-400' 
                : 'text-gray-500 hover:text-gray-300'}`}
          >
            MARKET
          </button>
        </div>

        {/* Quantity Input */}
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 font-mono uppercase">
            Amount
          </label>
          <div className="relative">
            <input
              type="text"
              value={quantity}
              onChange={handleQuantityChange}
              onFocus={clearMessage}
              placeholder="0.00"
              className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2.5 
                         text-white placeholder-gray-600 font-mono text-sm
                         focus:outline-none focus:border-gray-500
                         transition-colors"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs font-mono">
              {asset}
            </span>
          </div>
        </div>

        {/* Price Input */}
        {orderType === 'LIMIT' && (
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-mono uppercase">
              Price
            </label>
            <div className="relative">
              <input
                type="text"
                value={price}
                onChange={handlePriceChange}
                onFocus={clearMessage}
                placeholder="0.00"
                className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2.5 
                           text-white placeholder-gray-600 font-mono text-sm
                           focus:outline-none focus:border-gray-500
                           transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs font-mono">
                USD
              </span>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-terminal-bg rounded p-3 space-y-2 border border-terminal-border/50">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-gray-500">Total</span>
            <span className="text-white">
              ${notional.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between text-xs font-mono">
            <span className="text-gray-500">Type</span>
            <span className="text-white">{orderType}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleSubmit('BUY')}
            disabled={isSubmitting}
            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/30
                       text-white text-xs font-mono font-semibold rounded transition-colors
                       focus:outline-none focus:ring-1 focus:ring-emerald-400"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
              </span>
            ) : (
              'BUY'
            )}
          </button>
          <button
            onClick={() => handleSubmit('SELL')}
            disabled={isSubmitting}
            className="py-2.5 px-4 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-600/30
                       text-white text-xs font-mono font-semibold rounded transition-colors
                       focus:outline-none focus:ring-1 focus:ring-rose-400"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
              </span>
            ) : (
              'SELL'
            )}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-2 rounded text-xs font-mono text-center ${
            message.type === 'success' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderForm;
