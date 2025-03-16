const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
    const { mangaId, content } = req.body;

    try {
        const comment = new Comment({
            manga: mangaId,
            user: req.user._id,
            content
        });
        await comment.save();
        res.status(201).json({ success: true, comment });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar comentário' });
    }
};

exports.getComments = async (req, res) => {
    const { mangaId } = req.params;

    try {
        const comments = await Comment.find({ manga: mangaId }).populate('user', 'username');
        res.json({ success: true, comments });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao carregar comentários' });
    }
};