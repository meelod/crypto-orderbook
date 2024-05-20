import React, { useState } from 'react';
import './App.css';
import Orderbook from './Orderbook';
import OrderForm from './OrderForm';

const App: React.FC = () => {
  // Initialize the selected asset state
  const [selectedAsset, setSelectedAsset] = useState<string>('BTC');
  const [orders, setOrders] = useState<any[]>([]);

  // Handle the asset change event
  const handleAssetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAsset(event.target.value);
  };

  const addOrder = (order: any) => {
    setOrders([...orders, order]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Cryptocurrency Order Book</h1>
        <select value={selectedAsset} onChange={handleAssetChange}>
          <option value="BTC">BTC</option>
          <option value="ETH">ETH</option>
        </select>
      </header>
      <div className="App-container"> {/* Wrap both components in a container */}
        <Orderbook asset={selectedAsset} orders={orders}/>
        <OrderForm asset={selectedAsset} addOrder={addOrder}/>
      </div>
    </div>
  );
};

export default App;
