import { randomUUID } from 'crypto';
import { Combo, CombosResponse, EnergyProfileItem } from 'shared-types';

// In a real implementation, this would use a database
interface ComboData {
  comboId: string;
  analysisId: string;
  generationIteration: number;
  sequence: string;
  punchCount: number;
  suggestedEnergyLevel: number;
  createdAt: Date;
}

// Temporary in-memory storage for MVP
const comboStorage = new Map<string, ComboData[]>();

export class ComboService {
  async generateCombosForSong(
    songId: string,
    analysisId: string,
    bpm: number,
    energyProfile: EnergyProfileItem[],
    count = 10
  ): Promise<string[]> {
    const comboIds: string[] = [];
    const combos: ComboData[] = [];
    
    for (let i = 0; i < count; i++) {
      const comboId = `cmb_${randomUUID().replace(/-/g, '')}`;
      comboIds.push(comboId);
      
      // Get energy level - pick a random one from the profile, or default to 2 (medium)
      const energyLevel = energyProfile.length > 0
        ? energyProfile[Math.floor(Math.random() * energyProfile.length)].energyLevel
        : 2;
      
      // Generate a combo based on the energy level
      const combo = this.generateCombo(bpm, energyLevel);
      
      const comboData: ComboData = {
        comboId,
        analysisId,
        generationIteration: 1,
        sequence: combo.sequence,
        punchCount: combo.punchCount,
        suggestedEnergyLevel: energyLevel,
        createdAt: new Date(),
      };
      
      combos.push(comboData);
    }
    
    comboStorage.set(songId, combos);
    return comboIds;
  }
  
  async getCombosBySongId(songId: string): Promise<CombosResponse | null> {
    const combos = comboStorage.get(songId);
    
    if (!combos || combos.length === 0) {
      return null;
    }
    
    return {
      songId,
      generatedAt: combos[0].createdAt.toISOString(),
      combos: combos.map(combo => ({
        comboId: combo.comboId,
        sequence: combo.sequence,
        punchCount: combo.punchCount,
        suggestedEnergyLevel: combo.suggestedEnergyLevel,
      })),
    };
  }
  
  async regenerateCombos(
    songId: string,
    analysisId: string,
    excludeComboIds: string[] = [],
    targetEnergyLevel?: number,
    count = 1
  ): Promise<CombosResponse | null> {
    const existingCombos = comboStorage.get(songId) || [];
    
    // Filter out excluded combos
    const filteredCombos = existingCombos.filter(
      combo => !excludeComboIds.includes(combo.comboId)
    );
    
    // Generate new combos
    const newCombos: ComboData[] = [];
    for (let i = 0; i < count; i++) {
      const comboId = `cmb_${randomUUID().replace(/-/g, '')}`;
      
      // Use target energy level or pick a random one (1-3)
      const energyLevel = targetEnergyLevel || Math.floor(Math.random() * 3) + 1;
      
      // Generate a combo based on the energy level
      const combo = this.generateCombo(120, energyLevel);
      
      const comboData: ComboData = {
        comboId,
        analysisId,
        generationIteration: 
          Math.max(...existingCombos.map(c => c.generationIteration), 0) + 1,
        sequence: combo.sequence,
        punchCount: combo.punchCount,
        suggestedEnergyLevel: energyLevel,
        createdAt: new Date(),
      };
      
      newCombos.push(comboData);
    }
    
    // Update storage with filtered + new combos
    const updatedCombos = [...filteredCombos, ...newCombos];
    comboStorage.set(songId, updatedCombos);
    
    return {
      songId,
      generatedAt: new Date().toISOString(),
      combos: updatedCombos.map(combo => ({
        comboId: combo.comboId,
        sequence: combo.sequence,
        punchCount: combo.punchCount,
        suggestedEnergyLevel: combo.suggestedEnergyLevel,
      })),
    };
  }
  
  // Generate a boxing combo based on BPM and energy level
  private generateCombo(bpm: number, energyLevel: number): {
    sequence: string;
    punchCount: number;
  } {
    // Punch vocabulary
    const punches = [
      '1', // Jab
      '2', // Cross
      '3', // Lead Hook
      '4', // Rear Hook
      '5', // Lead Uppercut
      '6', // Rear Uppercut
    ];
    
    // Determine combo length based on energy level
    let comboLength: number;
    switch (energyLevel) {
      case 1: // Low energy
        comboLength = 3 + (Math.random() > 0.5 ? 1 : 0); // 3-4 punches
        break;
      case 2: // Medium energy
        comboLength = 4 + Math.floor(Math.random() * 3); // 4-6 punches
        break;
      case 3: // High energy
        comboLength = 6 + Math.floor(Math.random() * 3); // 6-8 punches
        break;
      default:
        comboLength = 4; // Default to medium
    }
    
    // Construct a combo
    let sequence: string[] = [];
    
    // Start with common opening moves
    if (Math.random() > 0.3) {
      sequence.push('1');
      if (Math.random() > 0.5) {
        sequence.push('2');
      }
    } else {
      sequence.push(punches[Math.floor(Math.random() * punches.length)]);
    }
    
    // Add remaining punches
    while (sequence.length < comboLength) {
      const lastPunch = sequence[sequence.length - 1];
      let nextPunch: string;
      
      // Apply rules to avoid awkward transitions
      // Avoid consecutive rear power punches (2-2, 4-4, 6-6)
      if (['2', '4', '6'].includes(lastPunch)) {
        nextPunch = ['1', '3', '5'][Math.floor(Math.random() * 3)];
      } 
      // Higher chance of power punches in high energy
      else if (energyLevel === 3 && Math.random() > 0.5) {
        nextPunch = ['2', '3', '4', '5', '6'][Math.floor(Math.random() * 5)];
      }
      // Default punch selection
      else {
        nextPunch = punches[Math.floor(Math.random() * punches.length)];
      }
      
      sequence.push(nextPunch);
    }
    
    return {
      sequence: sequence.join('-'),
      punchCount: sequence.length,
    };
  }
}