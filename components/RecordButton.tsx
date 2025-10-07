
import React from 'react';
import { MicrophoneIcon } from './icons';

interface RecordButtonProps {
  isListening: boolean;
  onClick: () => void;
}

export const RecordButton: React.FC<RecordButtonProps> = ({ isListening, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 ${
        isListening ? 'bg-red-500' : 'bg-cyan-600 hover:bg-cyan-500'
      }`}
    >
      {isListening && <span className="absolute animate-ping-slow h-full w-full rounded-full bg-red-400 opacity-75"></span>}
      <MicrophoneIcon />
    </button>
  );
};
