const mongoose = require('mongoose');

const mangaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    cover_path: {
        type: String,
        default: '/images/default-cover.jpg'
    },
    genre: [{
        type: String,
        enum: ['Shonen', 'Shojo', 'Seinen', 'Josei', 'Mecha', 'Isekai']
    }],
    status: {
        type: String,
        enum: ['Ongoing', 'Completed', 'Hiatus'],
        default: 'Ongoing'
    },
    views: {
        type: Number,
        default: 0
    },
    rating: {
        average: {
            type: Number,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    },
    chapters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Manga', mangaSchema);

