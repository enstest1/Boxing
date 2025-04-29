import { z } from 'zod';

// Song upload response
export const songUploadResponseSchema = z.object({
  songId: z.string(),
  status: z.enum(['processing']),
  message: z.string(),
  estimatedCompletionTime: z.string().optional(),
});

export type SongUploadResponse = z.infer<typeof songUploadResponseSchema>;

// Analysis response
export const energyProfileItemSchema = z.object({
  startTime: z.number(),
  endTime: z.number(),
  energyLevel: z.number().min(1).max(3),
});

export const analysisResponseSchema = z.object({
  songId: z.string(),
  status: z.enum(['processing', 'completed', 'failed']),
  analyzedAt: z.string().optional(),
  results: z
    .object({
      bpm: z.number(),
      variableBpm: z.boolean(),
      durationSeconds: z.number(),
      energyProfile: z.array(energyProfileItemSchema),
    })
    .optional(),
  errorMessage: z.string().nullable(),
});

export type AnalysisResponse = z.infer<typeof analysisResponseSchema>;
export type EnergyProfileItem = z.infer<typeof energyProfileItemSchema>;

// Combo response
export const comboSchema = z.object({
  comboId: z.string(),
  sequence: z.string(),
  punchCount: z.number(),
  suggestedEnergyLevel: z.number().min(1).max(3),
});

export const combosResponseSchema = z.object({
  songId: z.string(),
  generatedAt: z.string(),
  combos: z.array(comboSchema),
});

export type Combo = z.infer<typeof comboSchema>;
export type CombosResponse = z.infer<typeof combosResponseSchema>;

// Regenerate combos request
export const regenerateCombosRequestSchema = z.object({
  excludeComboIds: z.array(z.string()).optional(),
  targetEnergyLevel: z.number().min(1).max(3).optional(),
  count: z.number().min(1).optional(),
});

export type RegenerateCombosRequest = z.infer<typeof regenerateCombosRequestSchema>;