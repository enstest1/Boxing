import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import routes from '../src/routes';
import { errorHandler } from '../src/middleware/error-handler';

// Create a test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  // Mock uploads directory for tests
  const uploadDir = path.join(process.cwd(), 'test-uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  app.use('/api/v1', routes);
  app.use(errorHandler);
  
  return app;
};

describe('Song Routes', () => {
  const app = createTestApp();
  const request = supertest(app);
  let testFilePath: string;
  
  // Create a dummy MP3 file for testing
  beforeAll(() => {
    const testDir = path.join(process.cwd(), 'test-files');
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    
    testFilePath = path.join(testDir, 'test-song.mp3');
    
    // Create a dummy MP3 file (not a real MP3, just for testing)
    const dummyData = Buffer.from('This is a test MP3 file');
    fs.writeFileSync(testFilePath, dummyData);
  });
  
  // Clean up after tests
  afterAll(() => {
    // Remove test file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
    
    // Remove test directories
    const testDir = path.join(process.cwd(), 'test-files');
    if (fs.existsSync(testDir)) {
      fs.rmdirSync(testDir);
    }
    
    const testUploadsDir = path.join(process.cwd(), 'test-uploads');
    if (fs.existsSync(testUploadsDir)) {
      fs.rmdirSync(testUploadsDir);
    }
  });
  
  it('should upload a song and return 202 with songId', async () => {
    // Mock the multer middleware to accept our test file
    const originalMulter = multer;
    (multer as any) = () => ({
      single: () => (_req: any, _res: any, next: any) => {
        _req.file = {
          path: testFilePath,
          originalname: 'test-song.mp3',
          mimetype: 'audio/mpeg',
          size: fs.statSync(testFilePath).size,
        };
        next();
      },
    });
    
    const response = await request
      .post('/api/v1/songs')
      .attach('file', testFilePath);
    
    // Restore multer
    (multer as any) = originalMulter;
    
    expect(response.status).toBe(202);
    expect(response.body).toHaveProperty('songId');
    expect(response.body.status).toBe('processing');
    
    // Store songId for later tests if needed
    const songId = response.body.songId;
    
    // Wait for analysis to complete (in a real test, we might poll)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test the analysis endpoint
    const analysisResponse = await request.get(`/api/v1/songs/${songId}/analysis`);
    expect(analysisResponse.status).toBe(200);
    
    // Test the combos endpoint
    const combosResponse = await request.get(`/api/v1/songs/${songId}/combos`);
    expect(combosResponse.status).toBe(200);
    expect(combosResponse.body).toHaveProperty('combos');
    expect(Array.isArray(combosResponse.body.combos)).toBe(true);
  });
});