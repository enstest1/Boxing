import { Router } from 'express';
import multer from 'multer';
import { songController } from '../controllers/song.controller';
import { songUploadLimiter } from '../middleware/rate-limit';
import { validateFileUpload } from '../middleware/validators';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB max size
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'audio/mpeg') {
      cb(null, true);
    } else {
      cb(new Error('Only MP3 files are supported'));
    }
  }
});

// Routes
router.post(
  '/',
  songUploadLimiter,
  upload.single('file'),
  validateFileUpload,
  songController.uploadSong
);

router.get(
  '/:songId/analysis',
  songController.getAnalysis
);

router.get(
  '/:songId/combos',
  songController.getCombos
);

router.post(
  '/:songId/combos/regenerate',
  songController.regenerateCombos
);

export default router;