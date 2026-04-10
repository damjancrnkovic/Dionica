export interface Stock {
  ticker: string;
  isin: string;
  name: string;
  lastPrice: number;
  change: number; // percent
  volume: number;
  turnover: number; // EUR
  high: number;
  low: number;
  segment: string;
  securityType: string;
}

export interface ZSEApiSecurity {
  date: string;
  mic: string;
  segment: string;
  symbol: string;
  isin: string;
  model: string;
  open_price: string | null;
  high_price: string | null;
  low_price: string | null;
  close_price: string | null;
  trade_date: string | null;
  vwap_price: string | null;
  change_percent: string | null;
  num_trades: number;
  volume: string;
  turnover: string;
  security_class: string;
  security_type: string;
  price_currency: string;
  turnover_currency: string;
  debt_maturity_date: string | null;
  debt_interest_rate: string | null;
}

export interface ZSEApiResponse {
  timestamp: string;
  mic: string;
  date: string;
  securities: ZSEApiSecurity[];
}

export interface HistoryPoint {
  date: string;
  close: number;
  high: number;
  low: number;
  volume: number;
  turnover: number;
}

export interface StockData {
  stocks: Stock[];
  topTurnover: Stock[];
  lastUpdated: string;
}
