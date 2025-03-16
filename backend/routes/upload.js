const express = require('express');
const router = express.Router();
const { upload, uploadController } = require('../controllers/uploadController');
const auth = require('../middleware/auth');

// Rotas de upload (protegidas)
router.post('/cover', auth.isAuthenticated, upload.single('cover'), uploadController.uploadCover);
router.post('/chapter', auth.isAuthenticated, upload.array('pages'), uploadController.uploadChapter);
router.post('/batch', auth.isAuthenticated, upload.array('pages'), uploadController.uploadBatch);

module.exports = router; 