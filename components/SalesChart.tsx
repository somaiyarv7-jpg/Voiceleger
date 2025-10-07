
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Transaction } from '../types';

interface SalesChartProps {
  salesData: Transaction[];
}

export const SalesChart: React.FC<SalesChartProps> = ({ salesData }) => {
  const aggregatedData = salesData.reduce((acc, curr) => {
    const existing = acc.find(item => item.item === curr.item);
    if (existing) {
      existing.totalSales += curr.totalSale;
      existing.quantitySold += curr.quantity;
    } else {
      acc.push({
        item: curr.item,
        totalSales: curr.totalSale,
        quantitySold: curr.quantity,
      });
    }
    return acc;
  }, [] as { item: string; totalSales: number; quantitySold: number }[]);

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Sales Data Overview</h2>
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <BarChart
                    data={aggregatedData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis dataKey="item" stroke="#A0AEC0" />
                    <YAxis yAxisId="left" orientation="left" stroke="#A0AEC0" />
                    <YAxis yAxisId="right" orientation="right" stroke="#A0AEC0" />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#1A202C', 
                            border: '1px solid #4A5568',
                            color: '#E2E8F0'
                        }} 
                        cursor={{fill: 'rgba(74, 85, 104, 0.4)'}}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="totalSales" fill="#2DD4BF" name="Total Sales ($)" />
                    <Bar yAxisId="right" dataKey="quantitySold" fill="#38BDF8" name="Quantity Sold" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};
