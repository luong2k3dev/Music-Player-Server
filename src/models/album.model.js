const mongoose = require('mongoose');

const { toJSON } = require('./plugins/index.plugin');

const albumSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        songs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Song',
            },
        ],
        singers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Singer',
            },
        ],
        releaseYear: {
            type: String,
        },
    },
    { timestimestamp: true },
);

albumSchema.plugin(toJSON);

const Album = mongoose.model('Album ', albumSchema);

module.exports = Album;