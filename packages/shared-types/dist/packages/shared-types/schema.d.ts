import { z } from 'zod';
export declare const songUploadResponseSchema: z.ZodObject<{
    songId: z.ZodString;
    status: z.ZodEnum<["processing"]>;
    message: z.ZodString;
    estimatedCompletionTime: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "processing";
    songId: string;
    message: string;
    estimatedCompletionTime?: string | undefined;
}, {
    status: "processing";
    songId: string;
    message: string;
    estimatedCompletionTime?: string | undefined;
}>;
export type SongUploadResponse = z.infer<typeof songUploadResponseSchema>;
export declare const energyProfileItemSchema: z.ZodObject<{
    startTime: z.ZodNumber;
    endTime: z.ZodNumber;
    energyLevel: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    startTime: number;
    endTime: number;
    energyLevel: number;
}, {
    startTime: number;
    endTime: number;
    energyLevel: number;
}>;
export declare const analysisResponseSchema: z.ZodObject<{
    songId: z.ZodString;
    status: z.ZodEnum<["processing", "completed", "failed"]>;
    analyzedAt: z.ZodOptional<z.ZodString>;
    results: z.ZodOptional<z.ZodObject<{
        bpm: z.ZodNumber;
        variableBpm: z.ZodBoolean;
        durationSeconds: z.ZodNumber;
        energyProfile: z.ZodArray<z.ZodObject<{
            startTime: z.ZodNumber;
            endTime: z.ZodNumber;
            energyLevel: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            startTime: number;
            endTime: number;
            energyLevel: number;
        }, {
            startTime: number;
            endTime: number;
            energyLevel: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        bpm: number;
        variableBpm: boolean;
        durationSeconds: number;
        energyProfile: {
            startTime: number;
            endTime: number;
            energyLevel: number;
        }[];
    }, {
        bpm: number;
        variableBpm: boolean;
        durationSeconds: number;
        energyProfile: {
            startTime: number;
            endTime: number;
            energyLevel: number;
        }[];
    }>>;
    errorMessage: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "processing" | "completed" | "failed";
    songId: string;
    errorMessage: string | null;
    analyzedAt?: string | undefined;
    results?: {
        bpm: number;
        variableBpm: boolean;
        durationSeconds: number;
        energyProfile: {
            startTime: number;
            endTime: number;
            energyLevel: number;
        }[];
    } | undefined;
}, {
    status: "processing" | "completed" | "failed";
    songId: string;
    errorMessage: string | null;
    analyzedAt?: string | undefined;
    results?: {
        bpm: number;
        variableBpm: boolean;
        durationSeconds: number;
        energyProfile: {
            startTime: number;
            endTime: number;
            energyLevel: number;
        }[];
    } | undefined;
}>;
export type AnalysisResponse = z.infer<typeof analysisResponseSchema>;
export type EnergyProfileItem = z.infer<typeof energyProfileItemSchema>;
export declare const comboSchema: z.ZodObject<{
    comboId: z.ZodString;
    sequence: z.ZodString;
    punchCount: z.ZodNumber;
    suggestedEnergyLevel: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    comboId: string;
    sequence: string;
    punchCount: number;
    suggestedEnergyLevel: number;
}, {
    comboId: string;
    sequence: string;
    punchCount: number;
    suggestedEnergyLevel: number;
}>;
export declare const combosResponseSchema: z.ZodObject<{
    songId: z.ZodString;
    generatedAt: z.ZodString;
    combos: z.ZodArray<z.ZodObject<{
        comboId: z.ZodString;
        sequence: z.ZodString;
        punchCount: z.ZodNumber;
        suggestedEnergyLevel: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        comboId: string;
        sequence: string;
        punchCount: number;
        suggestedEnergyLevel: number;
    }, {
        comboId: string;
        sequence: string;
        punchCount: number;
        suggestedEnergyLevel: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    songId: string;
    generatedAt: string;
    combos: {
        comboId: string;
        sequence: string;
        punchCount: number;
        suggestedEnergyLevel: number;
    }[];
}, {
    songId: string;
    generatedAt: string;
    combos: {
        comboId: string;
        sequence: string;
        punchCount: number;
        suggestedEnergyLevel: number;
    }[];
}>;
export type Combo = z.infer<typeof comboSchema>;
export type CombosResponse = z.infer<typeof combosResponseSchema>;
export declare const regenerateCombosRequestSchema: z.ZodObject<{
    excludeComboIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    targetEnergyLevel: z.ZodOptional<z.ZodNumber>;
    count: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    excludeComboIds?: string[] | undefined;
    targetEnergyLevel?: number | undefined;
    count?: number | undefined;
}, {
    excludeComboIds?: string[] | undefined;
    targetEnergyLevel?: number | undefined;
    count?: number | undefined;
}>;
export type RegenerateCombosRequest = z.infer<typeof regenerateCombosRequestSchema>;
