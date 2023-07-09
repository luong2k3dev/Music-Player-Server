const mongoose = require('mongoose');

const { toJSON } = require('./plugins/index.plugin');

const songSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        singer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Singer',
            required: true,
        },
        duration: {
            type: Number,
        },
        genre: {
            type: String,
        },
        filePath: {
            type: String,
            required: true,
        },
    },
    { timestimestamp: true },
);

songSchema.plugin(toJSON);

const Song = mongoose.model('Song ', songSchema);

module.exports = Song;
