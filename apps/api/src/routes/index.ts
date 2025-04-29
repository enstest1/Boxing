const express = require('express');
const router = express.Router();

// Define routes directly here to avoid dependencies
router.get('/songs', (req, res) => {
  res.json({ message: 'Songs API is working' });
});

// Simple demo endpoint
router.get('/songs/demo', (req, res) => {
  res.json({
    id: '123',
    name: 'Demo Song',
    url: `${req.protocol}://${req.headers.host}/uploads/demo.mp3`
  });
});

module.exports = router;