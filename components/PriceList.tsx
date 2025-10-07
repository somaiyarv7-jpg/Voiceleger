
import React from 'react';
import type { PriceListItem } from '../types';

interface PriceListProps {
  priceList: PriceListItem[];
}

export const PriceList: React.FC<PriceListProps> = ({ priceList }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Master Price List</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Current Price
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                    {priceList.sort((a,b) => a.item.localeCompare(b.item)).map((item) => (
                        <tr key={item.item} className="hover:bg-gray-700/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{item.item}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-400 font-semibold">${item.price.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};
