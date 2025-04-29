import { AnalysisResponse } from 'shared-types';

interface AnalysisResultsDisplayProps {
  analysisData: AnalysisResponse;
}

export default function AnalysisResultsDisplay({ analysisData }: AnalysisResultsDisplayProps) {
  if (analysisData.status === 'processing') {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Analysis in Progress</h2>
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <p>Processing your song...</p>
        </div>
      </div>
    );
  }

  if (analysisData.status === 'failed') {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-red-700">Analysis Failed</h2>
        <p className="text-red-600">{analysisData.errorMessage || 'Unknown error'}</p>
      </div>
    );
  }

  // Only display results if status is 'completed' and results exist
  if (analysisData.status !== 'completed' || !analysisData.results) {
    return null;
  }

  const { bpm, variableBpm, durationSeconds, energyProfile } = analysisData.results;
  
  // Convert duration to minutes:seconds format
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = Math.floor(durationSeconds % 60);
  const durationFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <p className="text-sm text-gray-500">BPM</p>
          <p className="text-2xl font-bold">{bpm.toFixed(1)}</p>
          {variableBpm && (
            <p className="text-xs text-amber-600 mt-1">
              Variable tempo detected
            </p>
          )}
        </div>
        
        <div className="bg-white p-4 rounded-md shadow-sm">
          <p className="text-sm text-gray-500">Duration</p>
          <p className="text-2xl font-bold">{durationFormatted}</p>
          <p className="text-xs text-gray-400 mt-1">
            {Math.round(durationSeconds)} seconds
          </p>
        </div>
      </div>
      
      {energyProfile.length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-semibold mb-2">Energy Profile</h3>
          <div className="h-8 w-full rounded-md overflow-hidden flex">
            {energyProfile.map((segment, index) => {
              // Determine width based on segment duration relative to total duration
              const widthPercent = ((segment.endTime - segment.startTime) / durationSeconds) * 100;
              
              // Determine color based on energy level
              let bgColor = 'bg-blue-200';
              if (segment.energyLevel === 2) bgColor = 'bg-blue-400';
              if (segment.energyLevel === 3) bgColor = 'bg-blue-600';
              
              return (
                <div 
                  key={index}
                  className={`${bgColor} h-full`} 
                  style={{ width: `${widthPercent}%` }}
                  title={`${segment.startTime}s - ${segment.endTime}s (Level ${segment.energyLevel})`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>0:00</span>
            <span>{durationFormatted}</span>
          </div>
          <div className="flex justify-between mt-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-200 rounded-sm mr-1"></div>
              <span className="text-xs">Low</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-400 rounded-sm mr-1"></div>
              <span className="text-xs">Medium</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-sm mr-1"></div>
              <span className="text-xs">High</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}