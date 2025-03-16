const Manga = require('../models/Manga');
const Chapter = require('../models/Chapter');
const logger = require('../config/logger');

const mangaController = {
    // Listar todos os mangás
    getAllMangas: async (req, res) => {
        try {
            const mangas = await Manga.find();
            res.json({ success: true, data: mangas });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Obter um mangá específico
    getMangaById: async (req, res) => {
        try {
            const manga = await Manga.findById(req.params.id);
            if (!manga) {
                return res.status(404).json({ success: false, message: 'Mangá não encontrado' });
            }
            res.json({ success: true, data: manga });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Criar novo mangá
    createManga: async (req, res) => {
        try {
            const manga = new Manga(req.body);
            await manga.save();
            res.status(201).json({ success: true, data: manga });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    // Atualizar mangá
    updateManga: async (req, res) => {
        try {
            const manga = await Manga.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!manga) {
                return res.status(404).json({ success: false, message: 'Mangá não encontrado' });
            }
            res.json({ success: true, data: manga });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    // Deletar mangá
    deleteManga: async (req, res) => {
        try {
            const manga = await Manga.findByIdAndDelete(req.params.id);
            if (!manga) {
                return res.status(404).json({ success: false, message: 'Mangá não encontrado' });
            }
            res.json({ success: true, message: 'Mangá deletado com sucesso' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getMangaList: async (req, res) => {
        try {
            const { page = 1, limit = 10, genre, status } = req.query;
            const query = {};

            if (genre) query.genre = genre;
            if (status) query.status = status;

            const mangas = await Manga.find(query)
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .sort({ createdAt: -1 });

            const count = await Manga.countDocuments(query);

            res.json({
                success: true,
                data: {
                    mangas,
                    totalPages: Math.ceil(count / limit),
                    currentPage: page
                }
            });
        } catch (error) {
            logger.error('Error in getMangaList:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar lista de mangás'
            });
        }
    },

    getMangaDetails: async (req, res) => {
        const { id } = req.params;

        try {
            const manga = await Manga.findById(id).populate('chapters');
            if (!manga) {
                return res.status(404).json({ message: 'Mangá não encontrado' });
            }
            res.json({ success: true, manga });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao carregar detalhes do mangá' });
        }
    },

    uploadCover: async (req, res) => {
        try {
            const coverPath = req.file.path;
            res.json({ success: true, coverPath });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao fazer upload da capa' });
        }
    },

    uploadChapter: async (req, res) => {
        const { mangaId, number } = req.body;
        const pages = req.files.map(file => file.path).sort((a, b) => {
            // Ordena as páginas pelo nome do arquivo (assumindo que os nomes contêm números)
            return a.localeCompare(b, undefined, { numeric: true });
        });

        try {
            const chapter = new Chapter({ manga: mangaId, number, pages });
            await chapter.save();
            res.status(201).json({ success: true, chapter });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao fazer upload do capítulo' });
        }
    },

    // Métodos adicionais
    getFeaturedMangas: async (req, res) => {
        try {
            const featured = await Manga.find()
                .sort({ rating: -1 })
                .limit(5);
            res.json({ success: true, data: featured });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getLatestUpdates: async (req, res) => {
        try {
            const latest = await Manga.find()
                .sort({ updatedAt: -1 })
                .limit(12);
            res.json({ success: true, data: latest });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getPopularMangas: async (req, res) => {
        try {
            const popular = await Manga.find()
                .sort({ views: -1 })
                .limit(12);
            res.json({ success: true, data: popular });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getMangas: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 20;
            const skip = (page - 1) * limit;

            const mangas = await Manga.find()
                .skip(skip)
                .limit(limit)
                .lean();

            const total = await Manga.countDocuments();

            res.json({
                success: true,
                data: mangas,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalItems: total
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erro no servidor' });
        }
    }
};

module.exports = mangaController;