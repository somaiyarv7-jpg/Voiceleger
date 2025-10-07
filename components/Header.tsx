
import React from 'react';
import { View } from '../types';
import { ChartBarIcon, DocumentTextIcon, HomeIcon, TagIcon } from './icons';

interface HeaderProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { view: View.DASHBOARD, label: 'Dashboard', icon: <HomeIcon /> },
    { view: View.SALES_DATA, label: 'Sales Data', icon: <ChartBarIcon /> },
    { view: View.PRICE_LIST, label: 'Price List', icon: <TagIcon /> },
    { view: View.HISTORY, label: 'History', icon: <DocumentTextIcon /> },
  ];

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center pb-4 border-b border-gray-700">
      <div className="flex items-center mb-4 sm:mb-0">
        <div className="w-12 h-12 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10m16-10v10M8 7v10m8-10v10m-4-2v2m0-6v2m0-6v2" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white">VoiceLedger AI</h1>
      </div>
      <nav className="flex space-x-2 bg-gray-800 p-1.5 rounded-lg">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setActiveView(item.view)}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              activeView === item.view
                ? 'bg-cyan-500 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
};
