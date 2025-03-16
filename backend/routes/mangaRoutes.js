const express = require('express');
const router = express.Router();
const mangaController = require('../controllers/mangaController');
const authMiddleware = require('../middlewares/authMiddleware');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/manga:
 *   post:
 *     summary: Cria um novo mangá
 *     tags: [Manga]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Manga'
 *     responses:
 *       201:
 *         description: Mangá criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Manga'
 */
router.post('/', authMiddleware, mangaController.createManga);
router.get('/', mangaController.getMangaList);
router.get('/:id', mangaController.getMangaDetails);

module.exports = router;

router.post('/:id/favorite', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (user.favorites.includes(id)) {
            user.favorites = user.favorites.filter(fav => fav.toString() !== id);
        } else {
            user.favorites.push(id);
        }
        await user.save();
        res.json({ success: true, favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao favoritar mangá' });
    }
});

router.post('/:id/rate', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;
    const userId = req.user._id;

    try {
        const manga = await Manga.findById(id);
        const existingRating = manga.ratings.find(rating => rating.user.toString() === userId);

        if (existingRating) {
            existingRating.value = value;
        } else {
            manga.ratings.push({ user: userId, value });
        }

        await manga.save();
        res.json({ success: true, ratings: manga.ratings });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao avaliar mangá' });
    }
});

router.get('/', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const mangas = await Manga.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('chapters');

        const count = await Manga.countDocuments();
        res.json({
            success: true,
            mangas,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao carregar mangás' });
    }
});