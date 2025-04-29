import { useMutation, useQueryClient } from '@tanstack/react-query';
import { call, Combo, regenerateCombosRequestSchema } from 'shared-types';
import ComboCard from './ComboCard';

interface ComboListProps {
  combos: Combo[];
  songId: string;
}

export default function ComboList({ combos, songId }: ComboListProps) {
  const queryClient = useQueryClient();
  
  const regenerateMutation = useMutation({
    mutationFn: async (comboId: string) => {
      const payload = regenerateCombosRequestSchema.parse({
        excludeComboIds: [comboId],
        count: 1
      });
      
      const response = await call({
        url: `/api/v1/songs/${songId}/combos/regenerate`,
        method: 'POST',
        data: payload,
      });
      
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch combos query
      queryClient.invalidateQueries({ queryKey: ['combos', songId] });
    },
  });

  const handleRegenerateClick = (comboId: string) => {
    regenerateMutation.mutate(comboId);
  };

  if (!combos.length) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No combos available yet</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Generated Combos</h2>
      
      {regenerateMutation.isPending && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-sm text-blue-700">Regenerating combo...</span>
        </div>
      )}
      
      {regenerateMutation.isError && (
        <div className="mb-4 p-3 bg-red-50 rounded-md">
          <p className="text-sm text-red-700">
            Failed to regenerate combo. Please try again.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {combos.map(combo => (
          <ComboCard
            key={combo.comboId}
            combo={combo}
            onRegenerateClick={handleRegenerateClick}
          />
        ))}
      </div>
    </div>
  );
}