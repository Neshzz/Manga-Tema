const express = require('express');
const router = express.Router();
const upload = require('../utils/fileUpload');
const mangaController = require('../controllers/mangaController');
const authMiddleware = require('../middlewares/authMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  const upload = multer({ storage });
  
  router.post('/', authMiddleware, upload.single('file'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Nenhum arquivo enviado' });
      }
      
      res.json({
        success: true,
        filePath: `/public/uploads/${req.file.filename}`
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

router.post('/cover', authMiddleware, upload.single('cover'), mangaController.uploadCover);
router.post('/chapter', authMiddleware, upload.array('pages', 50), mangaController.uploadChapter);

module.exports = router;