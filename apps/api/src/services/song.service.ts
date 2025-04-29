import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs';
import { SongUploadResponse } from 'shared-types';

// In a real implementation, we would use a database and queue
interface SongData {
  songId: string;
  originalFilename: string;
  storagePath: string;
  fileSizeBytes: number;
  mimeType: string;
  uploadStatus: 'pending' | 'uploaded' | 'failed';
  uploadedAt: Date;
}

// Temporary in-memory storage for MVP
const songStorage = new Map<string, SongData>();

export class SongService {
  private uploadDir: string;

  constructor() {
    // Create temporary upload directory if it doesn't exist
    this.uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveSong(file: Express.Multer.File): Promise<SongUploadResponse> {
    try {
      const songId = `sng_${randomUUID().replace(/-/g, '')}`;
      const storagePath = path.join(this.uploadDir, `${songId}.mp3`);

      // Copy the file from multer temporary storage to our storage location
      fs.copyFileSync(file.path, storagePath);

      // Store song metadata
      const songData: SongData = {
        songId,
        originalFilename: file.originalname,
        storagePath,
        fileSizeBytes: file.size,
        mimeType: file.mimetype,
        uploadStatus: 'uploaded',
        uploadedAt: new Date(),
      };

      songStorage.set(songId, songData);

      // In a real implementation, this would add to an analysis queue
      // analysisQueue.add('analyze-song', { songId, storagePath });

      return {
        songId,
        status: 'processing',
        message: 'Song uploaded successfully. Analysis in progress.',
        estimatedCompletionTime: new Date(Date.now() + 30000).toISOString(), // Estimate 30 seconds
      };
    } catch (error) {
      console.error('Error saving song:', error);
      throw error;
    }
  }

  async getSongById(songId: string): Promise<SongData | null> {
    return songStorage.get(songId) || null;
  }
}