const express = require('express');
const router = express.Router();
const mangaController = require('../controllers/mangaController');
const auth = require('../middleware/auth');

// Rotas básicas
router.get('/', mangaController.getAllMangas);
router.get('/featured', mangaController.getFeaturedMangas);
router.get('/latest', mangaController.getLatestUpdates);
router.get('/popular', mangaController.getPopularMangas);
router.get('/:id', mangaController.getMangaById);

// Rotas que precisam de autenticação
router.post('/', auth.isAuthenticated, auth.isAdmin, mangaController.createManga);
router.put('/:id', auth.isAuthenticated, auth.isAdmin, mangaController.updateManga);
router.delete('/:id', auth.isAuthenticated, auth.isAdmin, mangaController.deleteManga);

// Rotas de capítulos
router.get('/:id/chapters', mangaController.getMangaChapters);
router.post('/:id/chapters', mangaController.addChapter);
router.get('/chapter/:chapterId', mangaController.getChapter);

// Rotas de interação
router.post('/:id/favorite', auth.isAuthenticated, mangaController.toggleFavorite);
router.post('/:id/rate', auth.isAuthenticated, mangaController.rateManga);
router.post('/:id/comment', auth.isAuthenticated, mangaController.addComment);
router.get('/:id/comments', mangaController.getComments);

module.exports = router; 