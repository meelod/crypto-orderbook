# Cryptocurrency Orderbook

A real-time cryptocurrency orderbook interface built in **4 hours** as a frontend coding exercise.

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Express.js mock server
- **Assets**: BTC and ETH orderbook data
- **Design**: Trading terminal style UI

## Features

- **Live Orderbook**: Displays bids and asks with price, quantity, and USD amount
- **Depth Visualization**: Visual bars showing order size relative to max
- **Spread Indicator**: Shows current bid-ask spread
- **Asset Switching**: Toggle between BTC and ETH orderbooks
- **Order Placement**: Submit buy/sell limit orders via form
- **Real-time Updates**: Orders immediately reflect in the orderbook display
- **Scrollable Lists**: Independent scrolling for bids and asks sections

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Run

```bash
npm start
```

This starts both the React frontend and Express mock server concurrently.

## URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Mock Server | http://localhost:3001 |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/orderbook/:asset?` | GET | Fetch orderbook (BTC or ETH) |
| `/trade/` | POST | Submit a trade order |

### Trade Request Example

```bash
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"asset":"BTC","side":"BUY","type":"LIMIT","quantity":2,"price":61000,"notional":122000}' \
  http://localhost:3001/trade
```

## File Structure

```
├── server/
│   ├── server.js                 # Express mock server
│   └── data/
│       ├── btc_orderbook.json    # BTC order data
│       └── eth_orderbook.json    # ETH order data
├── src/
│   ├── App.tsx                   # Main app with header and layout
│   ├── components/
│   │   ├── Orderbook.tsx         # Orderbook display with depth bars
│   │   └── OrderForm.tsx         # Order submission form
│   ├── api/
│   │   └── api.ts                # API client functions
│   └── types/
│       └── index.ts              # TypeScript type definitions
├── tailwind.config.js            # Tailwind CSS configuration
└── ux/
    └── UX figma.png              # Original design mockup
```

## Key Files

### Frontend Components

| File | Purpose |
|------|---------|
| `src/App.tsx` | Root component with header, asset selector, and layout grid |
| `src/components/Orderbook.tsx` | Displays bids/asks with depth visualization and spread indicator |
| `src/components/OrderForm.tsx` | Limit/market order form with validation and loading states |
| `src/api/api.ts` | Typed fetch wrappers for `/orderbook` and `/trade` endpoints |
| `src/types/index.ts` | TypeScript interfaces for orders, trades, and component props |

### Backend

| File | Purpose |
|------|---------|
| `server/server.js` | Express server with orderbook and trade endpoints, request validation |
| `server/data/*.json` | Mock orderbook data for BTC and ETH |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │   App.tsx   │───▶│ Orderbook   │    │   OrderForm     │  │
│  │ (state mgmt)│    │ (bids/asks) │    │  (buy/sell)     │  │
│  └──────┬──────┘    └──────┬──────┘    └────────┬────────┘  │
│         │                  │                    │           │
└─────────┼──────────────────┼────────────────────┼───────────┘
          │                  │                    │
          │   GET /orderbook │      POST /trade   │
          │                  ▼                    ▼
┌─────────┴───────────────────────────────────────────────────┐
│                      MOCK SERVER                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   Express.js                        │    │
│  │  • /orderbook/:asset - returns JSON orderbook       │    │
│  │  • /trade - validates order, returns with UUID      │    │
│  └─────────────────────────────────────────────────────┘    │
│                            │                                │
│                            ▼                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              btc_orderbook.json                     │    │
│  │              eth_orderbook.json                     │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| Trading terminal aesthetic | Professional look familiar to crypto traders |
| Depth visualization bars | Quickly see order size distribution |
| Monospace typography | Better number alignment and terminal feel |
| Bids sorted high→low | Top of book shows best bid price |
| Asks sorted low→high | Bottom of asks shows best ask price |
| Independent scrolling | View full depth without losing context |
| Client-side order updates | Fast feedback; server persistence would be next step |

## Future Improvements

- Persist orders to server JSON files
- WebSocket for real-time price updates
- Market order execution
- Order matching engine simulation
- Highlight orders that would fill at market price
- Price chart integration

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 18.3.1 | Frontend framework |
| `typescript` | 4.9.5 | Type safety |
| `tailwindcss` | 3.4.1 | Utility-first CSS |
| `express` | 4.19.2 | Mock backend server |
| `uuid` | 9.0.1 | Order ID generation |
| `concurrently` | 6.0.0 | Run frontend + server together |
