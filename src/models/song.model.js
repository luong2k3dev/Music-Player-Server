const mongoose = require('mongoose');

const { toJSON, paginate } = require('./plugins/index.plugin');

const songSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: 'No image',
        },
        singers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Singer',
                required: true,
            },
        ],
        duration: {
            type: Number,
        },
        genre: {
            type: String,
        },
        lyrics: {
            type: String,
        },
        countListen: {
            type: Number,
            default: 0,
        },
        likeNumber: {
            type: Number,
            default: 0,
        },
        dislikeNumber: {
            type: Number,
            default: 0,
        },
        filePath: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

songSchema.plugin(toJSON);
songSchema.plugin(paginate);

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
