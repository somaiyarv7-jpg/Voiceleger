
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { SalesChart } from './components/SalesChart';
import { PriceList } from './components/PriceList';
import { HistoryView } from './components/HistoryView';
import { View, Transaction, PriceListItem, HistoryItem, AiResponse } from './types';
import { getPricingRecommendation } from './services/geminiService';

// Initial mock data
const initialSalesData: Transaction[] = [
  { item: 'T-Shirt', quantity: 10, totalSale: 250, date: '2023-10-01' },
  { item: 'Mug', quantity: 20, totalSale: 200, date: '2023-10-02' },
  { item: 'T-Shirt', quantity: 15, totalSale: 375, date: '2023-10-03' },
  { item: 'Cap', quantity: 12, totalSale: 180, date: '2023-10-04' },
  { item: 'Mug', quantity: 25, totalSale: 250, date: '2023-10-05' },
  { item: 'T-Shirt', quantity: 8, totalSale: 200, date: '2023-10-06' },
];

const initialPriceList: PriceListItem[] = [
  { item: 'T-Shirt', price: 25 },
  { item: 'Mug', price: 10 },
  { item: 'Cap', price: 15 },
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.DASHBOARD);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [salesData, setSalesData] = useState<Transaction[]>(initialSalesData);
  const [priceList, setPriceList] = useState<PriceListItem[]>(initialPriceList);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetPricingAdvice = useCallback(async (transcript: string) => {
    if (!transcript) {
      setError("Please provide a transaction description.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result: AiResponse = await getPricingRecommendation(transcript, salesData);

      const newHistoryItem: HistoryItem = {
        id: Date.now(),
        userQuery: transcript,
        aiResponse: result,
      };
      setHistory(prev => [newHistoryItem, ...prev]);

      const newTransaction: Transaction = {
        ...result.transaction,
        item: result.transaction.item.charAt(0).toUpperCase() + result.transaction.item.slice(1),
        date: new Date().toISOString().split('T')[0],
      };
      setSalesData(prev => [...prev, newTransaction]);

      setPriceList(prev => {
        const itemExists = prev.some(p => p.item.toLowerCase() === newTransaction.item.toLowerCase());
        if (itemExists) {
          return prev.map(p =>
            p.item.toLowerCase() === newTransaction.item.toLowerCase()
              ? { ...p, price: result.recommendation.recommendedPrice }
              : p
          );
        } else {
          return [...prev, { item: newTransaction.item, price: result.recommendation.recommendedPrice }];
        }
      });

      return result;
    } catch (err) {
      console.error(err);
      setError("Sorry, I couldn't get a pricing recommendation. Please try again.");
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [salesData]);

  const renderView = () => {
    switch (activeView) {
      case View.DASHBOARD:
        return <Dashboard 
                  onGetPricingAdvice={handleGetPricingAdvice} 
                  isLoading={isLoading} 
                  error={error}
                  salesData={salesData}
                />;
      case View.SALES_DATA:
        return <SalesChart salesData={salesData} />;
      case View.PRICE_LIST:
        return <PriceList priceList={priceList} />;
      case View.HISTORY:
        return <HistoryView history={history} />;
      default:
        return <Dashboard onGetPricingAdvice={handleGetPricingAdvice} isLoading={isLoading} error={error} salesData={salesData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 selection:bg-cyan-500/30">
      <div className="w-full max-w-7xl mx-auto">
        <Header activeView={activeView} setActiveView={setActiveView} />
        <main className="mt-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
