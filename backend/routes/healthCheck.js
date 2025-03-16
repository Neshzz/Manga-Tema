const express = require('express');
const router = express.Router();

router.get('/check', (req, res) => {
  res.json({ 
    status: 'online',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 