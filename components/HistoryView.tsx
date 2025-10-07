
import React from 'react';
import type { HistoryItem } from '../types';
import { UserIcon, SparklesIcon } from './icons';

interface HistoryProps {
  history: HistoryItem[];
}

export const HistoryView: React.FC<HistoryProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 text-center">
        <h2 className="text-xl font-semibold text-white mb-2">No History Yet</h2>
        <p className="text-gray-400">Your past interactions will appear here once you log a transaction.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Interaction History</h2>
        <div className="space-y-6">
            {history.map((item) => (
                <div key={item.id} className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <div className="mb-4">
                        <div className="flex items-start text-sm text-gray-400 mb-2">
                           <UserIcon />
                           <span className="font-semibold text-gray-300 ml-2">You:</span>
                        </div>
                        <p className="ml-8 text-gray-200">{item.userQuery}</p>
                    </div>
                    <div>
                        <div className="flex items-start text-sm text-cyan-400 mb-2">
                            <SparklesIcon />
                            <span className="font-semibold text-cyan-300 ml-2">AI Response:</span>
                        </div>
                        <p className="ml-8 text-cyan-200 bg-gray-800/50 p-3 rounded-md">
                            {item.aiResponse.recommendation.spokenRecommendation}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};
