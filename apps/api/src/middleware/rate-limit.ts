import rateLimit from 'express-rate-limit';

// Create rate limiter for song uploads - 20 per hour per IP
export const songUploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 20, // 20 requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'TooManyRequests',
    message: 'Too many upload requests, please try again later',
  },
});