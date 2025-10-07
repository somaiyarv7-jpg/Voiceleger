
export enum View {
  DASHBOARD = 'DASHBOARD',
  SALES_DATA = 'SALES_DATA',
  PRICE_LIST = 'PRICE_LIST',
  HISTORY = 'HISTORY',
}

export interface Transaction {
  item: string;
  quantity: number;
  totalSale: number;
  pricePerItem?: number;
  date: string;
}

export interface PriceListItem {
  item: string;
  price: number;
}

export interface AiResponse {
  transaction: {
    item: string;
    quantity: number;
    pricePerItem: number;
    totalSale: number;
  };
  recommendation: {
    recommendedPrice: number;
    reasoning: string;
    spokenRecommendation: string;
  };
}

export interface HistoryItem {
  id: number;
  userQuery: string;
  aiResponse: AiResponse;
}

export interface RoiDataPoint {
  date: string;
  currentProfit: number;
  projectedProfit: number;
}
