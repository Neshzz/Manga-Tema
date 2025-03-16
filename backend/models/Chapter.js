const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    manga: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manga',
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    title: String,
    pages: [{
        number: Number,
        image_path: String
    }],
    views: {
        type: Number,
        default: 0
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Chapter', chapterSchema);