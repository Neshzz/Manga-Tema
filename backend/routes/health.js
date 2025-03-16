const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/health', async (req, res) => {
  const status = {
    db: mongoose.connection.readyState === 1 ? 'OK' : 'ERROR',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: Date.now()
  };

  res.status(status.db === 'OK' ? 200 : 503).json(status);
});

module.exports = router;