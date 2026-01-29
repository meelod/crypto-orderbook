import React, { useState, useCallback } from 'react';
import Orderbook from './components/Orderbook';
import OrderForm from './components/OrderForm';
import { TradeResponse } from './types';

const ASSETS = ['BTC', 'ETH'] as const;
type Asset = typeof ASSETS[number];

const App: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<Asset>('BTC');
  const [orders, setOrders] = useState<TradeResponse[]>([]);

  const handleAssetChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAsset(event.target.value as Asset);
  }, []);

  const handleOrderPlaced = useCallback((order: TradeResponse) => {
    setOrders(prev => [...prev, order]);
  }, []);

  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Header */}
      <header className="bg-terminal-card border-b border-terminal-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">OB</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Orderbook
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <select
              id="asset-select"
              value={selectedAsset}
              onChange={handleAssetChange}
              className="bg-terminal-bg text-white px-4 py-2 rounded border border-terminal-border 
                         focus:outline-none focus:border-gray-500
                         cursor-pointer font-mono font-medium"
            >
              {ASSETS.map(asset => (
                <option key={asset} value={asset}>
                  {asset}/USD
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orderbook */}
          <div className="lg:col-span-2">
            <Orderbook asset={selectedAsset} orders={orders} />
          </div>
          
          {/* Order Form */}
          <div>
            <OrderForm asset={selectedAsset} onOrderPlaced={handleOrderPlaced} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-terminal-card border-t border-terminal-border px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm">
          <span className="text-gray-500 font-mono">Mock Trading Interface</span>
          <span className="flex items-center gap-2 text-gray-400">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="font-mono">CONNECTED</span>
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
