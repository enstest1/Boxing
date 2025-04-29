import { Request, Response, NextFunction } from 'express';
import { SongService } from '../services/song.service';
import { AnalysisService } from '../services/analysis.service';
import { ComboService } from '../services/combo.service';
import { regenerateCombosRequestSchema } from 'shared-types';
import { ApiError } from '../middleware/error-handler';

const songService = new SongService();
const analysisService = new AnalysisService();
const comboService = new ComboService();

export class SongController {
  // Upload a song
  async uploadSong(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new ApiError(400, 'No file uploaded');
      }
      
      const result = await songService.saveSong(req.file);
      
      // Create analysis entry
      const analysisId = await analysisService.createAnalysis(result.songId);
      
      // In a real app, this would be in a worker process
      // Simulate starting the analysis
      setTimeout(() => {
        analysisService.performAnalysis(result.songId)
          .then(async () => {
            const analysis = await analysisService.getAnalysisBySongId(result.songId);
            if (analysis?.results) {
              await comboService.generateCombosForSong(
                result.songId,
                analysisId,
                analysis.results.bpm,
                analysis.results.energyProfile
              );
            }
          })
          .catch(error => console.error('Background analysis failed:', error));
      }, 1000);
      
      return res.status(202).json(result);
    } catch (error) {
      next(error);
    }
  }
  
  // Get song analysis
  async getAnalysis(req: Request, res: Response, next: NextFunction) {
    try {
      const { songId } = req.params;
      
      const analysisResult = await analysisService.getAnalysisBySongId(songId);
      if (!analysisResult) {
        throw new ApiError(404, `Analysis not found for song ID: ${songId}`);
      }
      
      return res.status(200).json(analysisResult);
    } catch (error) {
      next(error);
    }
  }
  
  // Get song combos
  async getCombos(req: Request, res: Response, next: NextFunction) {
    try {
      const { songId } = req.params;
      
      const combos = await comboService.getCombosBySongId(songId);
      if (!combos) {
        throw new ApiError(404, `Combos not found for song ID: ${songId}`);
      }
      
      return res.status(200).json(combos);
    } catch (error) {
      next(error);
    }
  }
  
  // Regenerate combos
  async regenerateCombos(req: Request, res: Response, next: NextFunction) {
    try {
      const { songId } = req.params;
      
      // Validate request body
      const { excludeComboIds, targetEnergyLevel, count } = 
        regenerateCombosRequestSchema.parse(req.body);
      
      // Check if song and analysis exist
      const song = await songService.getSongById(songId);
      if (!song) {
        throw new ApiError(404, `Song not found with ID: ${songId}`);
      }
      
      const analysis = await analysisService.getAnalysisBySongId(songId);
      if (!analysis) {
        throw new ApiError(404, `Analysis not found for song ID: ${songId}`);
      }
      
      // Regenerate combos
      const regeneratedCombos = await comboService.regenerateCombos(
        songId,
        'analysisId', // In a real app, we would get this from the database
        excludeComboIds,
        targetEnergyLevel,
        count
      );
      
      if (!regeneratedCombos) {
        throw new ApiError(500, 'Failed to regenerate combos');
      }
      
      return res.status(200).json(regeneratedCombos);
    } catch (error) {
      next(error);
    }
  }
}

export const songController = new SongController();