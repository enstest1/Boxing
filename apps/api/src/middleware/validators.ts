import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ApiError } from './error-handler';

export function validateFileUpload(req: Request, _res: Response, next: NextFunction) {
  // Check if a file is provided
  if (!req.file) {
    return next(new ApiError(400, 'No file uploaded'));
  }

  // Check file mime type
  if (req.file.mimetype !== 'audio/mpeg') {
    return next(new ApiError(400, 'Only MP3 files are supported'));
  }

  // Check file size (15MB max)
  const maxSizeInBytes = 15 * 1024 * 1024; // 15MB
  if (req.file.size > maxSizeInBytes) {
    return next(new ApiError(413, 'File size exceeds the maximum limit of 15MB'));
  }

  next();
}

export function validateRequest<T extends z.ZodType>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}