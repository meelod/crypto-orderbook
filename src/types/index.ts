// Order types
export interface Order {
  price: string;
  quantity: string;
}

export interface OrderbookData {
  bids: Order[];
  asks: Order[];
}

export interface RawOrder {
  price: string;
  quantity: string;
}

// Trade types
export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'LIMIT' | 'MARKET';

export interface TradeOrder {
  asset: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price?: number;
  notional: number;
}

export interface TradeResponse extends TradeOrder {
  id: string;
  timestamp: number;
}

// Component props
export interface OrderbookProps {
  asset: string;
  orders: TradeResponse[];
}

export interface OrderFormProps {
  asset: string;
  onOrderPlaced: (order: TradeResponse) => void;
}

// API response types
export interface OrderbookResponse {
  bids: [string, string][];
  asks: [string, string][];
}
