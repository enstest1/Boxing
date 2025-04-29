import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { call, AnalysisResponse, CombosResponse } from 'shared-types';
import Layout from '../components/Layout';
import AnalysisResultsDisplay from '../components/AnalysisResultsDisplay';
import ComboList from '../components/ComboList';

export default function AnalysisPage() {
  const { songId } = useParams<{ songId: string }>();

  // Fetch analysis data with polling until complete
  const analysisQuery = useQuery({
    queryKey: ['analysis', songId],
    queryFn: async () => {
      const response = await call<AnalysisResponse>({
        url: `/api/v1/songs/${songId}/analysis`,
        method: 'GET',
      });
      return response.data;
    },
    // Polling configuration
    refetchInterval: (data) => {
      // Stop polling when analysis is completed or failed
      return data && (data.status === 'completed' || data.status === 'failed')
        ? false 
        : 2000; // Poll every 2 seconds while processing
    },
    enabled: !!songId,
  });

  // Fetch combos once analysis is complete
  const combosQuery = useQuery({
    queryKey: ['combos', songId],
    queryFn: async () => {
      const response = await call<CombosResponse>({
        url: `/api/v1/songs/${songId}/combos`,
        method: 'GET',
      });
      return response.data;
    },
    enabled: !!songId && analysisQuery.data?.status === 'completed',
  });

  if (!songId) {
    return (
      <Layout>
        <div className="text-center p-8">
          <p className="text-red-600">Invalid song ID</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Song Analysis</h2>
        <p className="text-gray-600">Song ID: {songId}</p>
      </div>

      {analysisQuery.isPending && (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading analysis data...</p>
        </div>
      )}

      {analysisQuery.isError && (
        <div className="p-6 bg-red-50 rounded-lg">
          <h3 className="text-xl font-semibold text-red-700 mb-2">Error Loading Analysis</h3>
          <p className="text-red-600">
            {analysisQuery.error instanceof Error 
              ? analysisQuery.error.message 
              : 'An unexpected error occurred'}
          </p>
        </div>
      )}

      {analysisQuery.data && (
        <div className="mb-8">
          <AnalysisResultsDisplay analysisData={analysisQuery.data} />
        </div>
      )}

      {/* Combos Section */}
      {analysisQuery.data?.status === 'completed' && (
        <div className="mt-10">
          {combosQuery.isPending && (
            <div className="p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading combos...</p>
            </div>
          )}

          {combosQuery.isError && (
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-red-600">
                Failed to load combos. Please try refreshing.
              </p>
            </div>
          )}

          {combosQuery.data && (
            <ComboList 
              combos={combosQuery.data.combos} 
              songId={songId} 
            />
          )}
        </div>
      )}
    </Layout>
  );
}