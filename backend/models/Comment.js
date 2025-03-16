const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    manga: { type: mongoose.Schema.Types.ObjectId, ref: 'Manga', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);