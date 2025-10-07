
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AiResponse, Transaction } from '../types';
import { RecordButton } from './RecordButton';
import { RoiChart } from './RoiChart';
import { PlayIcon, SparklesIcon, TransactionIcon } from './icons';

interface DashboardProps {
  onGetPricingAdvice: (transcript: string) => Promise<AiResponse | undefined>;
  isLoading: boolean;
  error: string | null;
  salesData: Transaction[];
}

// @ts-ignore
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
  recognition.continuous = true;
  recognition.interimResults = true;
}

export const Dashboard: React.FC<DashboardProps> = ({ onGetPricingAdvice, isLoading, error, salesData }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState<AiResponse | null>(null);
  const finalTranscriptRef = useRef('');

  const processAndSubmit = useCallback(async (text: string) => {
    const response = await onGetPricingAdvice(text);
    if (response) {
      setAiResponse(response);
    }
  }, [onGetPricingAdvice]);

  useEffect(() => {
    if (!recognition) return;

    const handleResult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscriptRef.current + interimTranscript);
    };

    recognition.addEventListener('result', handleResult);

    return () => {
      recognition.removeEventListener('result', handleResult);
    };
  }, []);

  const toggleListening = () => {
    if (!recognition) {
        alert("Speech recognition is not supported in this browser.");
        return;
    }
    
    if (isListening) {
      recognition.stop();
      if(finalTranscriptRef.current) {
        setTranscript(finalTranscriptRef.current);
        processAndSubmit(finalTranscriptRef.current);
      }
    } else {
      finalTranscriptRef.current = '';
      setTranscript('');
      recognition.start();
    }
    setIsListening(!isListening);
  };
  
  const handleTextSubmit = () => {
    if (transcript && !isLoading) {
      finalTranscriptRef.current = transcript;
      processAndSubmit(transcript);
    }
  };

  const speakRecommendation = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in this browser.");
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Log a New Transaction</h2>
          <p className="text-sm text-gray-400 mb-4">Tap to record a transaction like "Sold 5 t-shirts for 25 dollars to a new customer." You can edit the text before getting advice.</p>
          <div className="flex items-center space-x-4 mb-4">
            <RecordButton isListening={isListening} onClick={toggleListening} />
            <p className={`text-sm ${isListening ? 'text-cyan-400 animate-pulse' : 'text-gray-400'}`}>
              {isListening ? 'Listening... Tap to stop.' : 'Tap to record'}
            </p>
          </div>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Your transcribed transaction will appear here..."
            className="w-full h-28 bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
          />
          <button
            onClick={handleTextSubmit}
            disabled={isLoading || !transcript}
            className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : "Get Pricing Advice"}
          </button>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>

        {aiResponse && (
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 animate-fade-in">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center"><SparklesIcon /> AI Recommendation</h3>
                </div>
                <button onClick={() => speakRecommendation(aiResponse.recommendation.spokenRecommendation)} className="flex items-center text-sm text-cyan-400 hover:text-cyan-300 transition">
                    <PlayIcon />
                    Listen
                </button>
            </div>
            <p className="text-cyan-300 text-lg font-medium bg-gray-900/50 p-4 rounded-md mb-4">
              {aiResponse.recommendation.spokenRecommendation}
            </p>
            <div className="text-sm text-gray-400 space-y-2">
                <p><span className="font-semibold text-gray-300">Reasoning:</span> {aiResponse.recommendation.reasoning}</p>
                <p><span className="font-semibold text-gray-300">Recommended Price:</span> <span className="text-white font-bold text-base">${aiResponse.recommendation.recommendedPrice.toFixed(2)}</span></p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-700">
                <h4 className="text-md font-semibold text-white mb-2 flex items-center"><TransactionIcon/> Processed Transaction</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-gray-400">Item: <span className="text-gray-200 font-medium">{aiResponse.transaction.item}</span></p>
                    <p className="text-gray-400">Quantity: <span className="text-gray-200 font-medium">{aiResponse.transaction.quantity}</span></p>
                    <p className="text-gray-400">Price/Item: <span className="text-gray-200 font-medium">${aiResponse.transaction.pricePerItem.toFixed(2)}</span></p>
                    <p className="text-gray-400">Total Sale: <span className="text-gray-200 font-medium">${aiResponse.transaction.totalSale.toFixed(2)}</span></p>
                </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Projected ROI</h3>
        <p className="text-sm text-gray-400 mb-4">This chart visualizes the projected profit increase based on AI-powered pricing adjustments over time.</p>
        <RoiChart salesData={salesData} />
      </div>
    </div>
  );
};
