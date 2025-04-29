"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regenerateCombosRequestSchema = exports.combosResponseSchema = exports.comboSchema = exports.analysisResponseSchema = exports.energyProfileItemSchema = exports.songUploadResponseSchema = void 0;
const zod_1 = require("zod");
// Song upload response
exports.songUploadResponseSchema = zod_1.z.object({
    songId: zod_1.z.string(),
    status: zod_1.z.enum(['processing']),
    message: zod_1.z.string(),
    estimatedCompletionTime: zod_1.z.string().optional(),
});
// Analysis response
exports.energyProfileItemSchema = zod_1.z.object({
    startTime: zod_1.z.number(),
    endTime: zod_1.z.number(),
    energyLevel: zod_1.z.number().min(1).max(3),
});
exports.analysisResponseSchema = zod_1.z.object({
    songId: zod_1.z.string(),
    status: zod_1.z.enum(['processing', 'completed', 'failed']),
    analyzedAt: zod_1.z.string().optional(),
    results: zod_1.z
        .object({
        bpm: zod_1.z.number(),
        variableBpm: zod_1.z.boolean(),
        durationSeconds: zod_1.z.number(),
        energyProfile: zod_1.z.array(exports.energyProfileItemSchema),
    })
        .optional(),
    errorMessage: zod_1.z.string().nullable(),
});
// Combo response
exports.comboSchema = zod_1.z.object({
    comboId: zod_1.z.string(),
    sequence: zod_1.z.string(),
    punchCount: zod_1.z.number(),
    suggestedEnergyLevel: zod_1.z.number().min(1).max(3),
});
exports.combosResponseSchema = zod_1.z.object({
    songId: zod_1.z.string(),
    generatedAt: zod_1.z.string(),
    combos: zod_1.z.array(exports.comboSchema),
});
// Regenerate combos request
exports.regenerateCombosRequestSchema = zod_1.z.object({
    excludeComboIds: zod_1.z.array(zod_1.z.string()).optional(),
    targetEnergyLevel: zod_1.z.number().min(1).max(3).optional(),
    count: zod_1.z.number().min(1).optional(),
});
