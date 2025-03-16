const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const mangaRoutes = require('./mangaRoutes');
const commentRoutes = require('./commentRoutes');
const uploadRoutes = require('./uploadRoutes');

router.use('/auth', authRoutes);
router.use('/manga', mangaRoutes);
router.use('/comments', commentRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
