
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Transaction, RoiDataPoint } from '../types';

interface RoiChartProps {
  salesData: Transaction[];
}

// A simple simulation for ROI projection
const calculateRoiData = (salesData: Transaction[]): RoiDataPoint[] => {
    if (salesData.length < 2) return [];

    let cumulativeProfit = 0;
    let projectedProfit = 0;
    const profitMargin = 0.4; // Assume a 40% profit margin
    const priceIncreaseEffect = 1.05; // Assume a 5% effectiveness of new price

    const sortedData = [...salesData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return sortedData.map(sale => {
        const saleProfit = sale.totalSale * profitMargin;
        cumulativeProfit += saleProfit;
        // Project future profit with a slight uplift from AI recommendations
        projectedProfit = (projectedProfit + saleProfit) * priceIncreaseEffect;

        return {
            date: sale.date,
            currentProfit: Math.round(cumulativeProfit),
            projectedProfit: Math.round(projectedProfit),
        };
    }).slice(-15); // Show last 15 data points
};

export const RoiChart: React.FC<RoiChartProps> = ({ salesData }) => {
  const roiData = calculateRoiData(salesData);

  if (roiData.length === 0) {
    return <p className="text-gray-400 text-center mt-8">Not enough data to project ROI. Log more transactions.</p>
  }

  return (
    <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
            <LineChart
                data={roiData}
                margin={{
                    top: 5,
                    right: 20,
                    left: 0,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="date" stroke="#A0AEC0" tick={{ fontSize: 12 }} />
                <YAxis stroke="#A0AEC0" tick={{ fontSize: 12 }} />
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: '#1A202C', 
                        border: '1px solid #4A5568',
                        color: '#E2E8F0'
                    }}
                    labelStyle={{ color: '#A0AEC0' }}
                />
                <Legend />
                <Line type="monotone" dataKey="currentProfit" name="Actual Profit" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="projectedProfit" name="Projected Profit (AI)" stroke="#2DD4BF" />
            </LineChart>
        </ResponsiveContainer>
    </div>
  );
};
