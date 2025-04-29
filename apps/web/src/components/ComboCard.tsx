import { useState } from 'react';
import { Combo } from 'shared-types';

interface ComboCardProps {
  combo: Combo;
  onRegenerateClick: (comboId: string) => void;
}

export default function ComboCard({ combo, onRegenerateClick }: ComboCardProps) {
  const [copied, setCopied] = useState(false);
  
  // Define energy level text and colors
  const energyLevelInfo = {
    1: { text: 'Low Energy', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
    2: { text: 'Medium Energy', bgColor: 'bg-blue-200', textColor: 'text-blue-800' },
    3: { text: 'High Energy', bgColor: 'bg-blue-300', textColor: 'text-blue-800' },
  }[combo.suggestedEnergyLevel] || { text: 'Energy', bgColor: 'bg-gray-100', textColor: 'text-gray-800' };

  const handleCopy = () => {
    navigator.clipboard.writeText(combo.sequence);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="flex justify-between items-start mb-3">
        <span 
          className={`px-2 py-1 text-xs rounded-full ${energyLevelInfo.bgColor} ${energyLevelInfo.textColor}`}
        >
          {energyLevelInfo.text}
        </span>
        <span className="text-xs text-gray-500">{combo.punchCount} punches</span>
      </div>
      
      <div className="text-xl font-bold mb-4 bg-gray-50 p-3 rounded">
        {combo.sequence}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={handleCopy}
          className="text-sm px-3 py-1 border rounded hover:bg-gray-50 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        
        <button
          onClick={() => onRegenerateClick(combo.comboId)}
          className="text-sm px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Regenerate
        </button>
      </div>
    </div>
  );
}