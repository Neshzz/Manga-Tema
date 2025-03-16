const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const type = req.body.uploadType || 'covers';
        const path = `./uploads/${type}`;
        cb(null, path);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Formato de arquivo inválido'));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 4 * 1024 * 1024 // 4MB
    }
});

const uploadController = {
    // Upload de capa
    uploadCover: (req, res) => {
        upload.single('cover')(req, res, async (err) => {
            if (err) return res.status(400).json({ success: false, message: err.message });
            
            try {
                const buffer = await sharp(req.file.buffer)
                    .resize(800, 1200)
                    .jpeg({ quality: 80 })
                    .toBuffer();

                // Salvar buffer no storage (S3/Disco)
                const imageUrl = await saveImageToStorage(buffer);
                
                res.json({ success: true, url: imageUrl });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Falha no processamento' });
            }
        });
    },

    // Upload de capítulo
    uploadChapter: async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Nenhuma imagem enviada' 
                });
            }

            const { mangaId, chapterNumber } = req.body;
            const chapterPath = `./uploads/chapters/${mangaId}/${chapterNumber}`;

            // Criar diretório se não existir
            await fs.mkdir(chapterPath, { recursive: true });

            // Processar cada imagem
            const processedFiles = await Promise.all(req.files.map(async (file, index) => {
                const filename = `${(index + 1).toString().padStart(3, '0')}.jpg`;
                const outputPath = path.join(chapterPath, filename);

                await sharp(file.path)
                    .jpeg({ quality: 80 })
                    .toFile(outputPath);

                await fs.unlink(file.path);

                return filename;
            }));

            res.json({
                success: true,
                data: {
                    chapterPath: `chapters/${mangaId}/${chapterNumber}`,
                    pages: processedFiles
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Upload em lote
    uploadBatch: async (req, res) => {
        try {
            const { mangaId, chapters } = req.body;
            const results = [];

            for (const chapter of chapters) {
                const chapterPath = `./uploads/chapters/${mangaId}/${chapter.number}`;
                await fs.mkdir(chapterPath, { recursive: true });

                const processedFiles = await Promise.all(chapter.files.map(async (file, index) => {
                    const filename = `${(index + 1).toString().padStart(3, '0')}.jpg`;
                    const outputPath = path.join(chapterPath, filename);

                    await sharp(file.path)
                        .jpeg({ quality: 80 })
                        .toFile(outputPath);

                    await fs.unlink(file.path);

                    return filename;
                }));

                results.push({
                    chapterNumber: chapter.number,
                    pages: processedFiles
                });
            }

            res.json({
                success: true,
                data: results
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = {
    upload,
    uploadController
}; 