const mongoose = require('mongoose');

const { toJSON, paginate } = require('./plugins/index.plugin');

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
    { timestamps: true },
);

songSchema.plugin(toJSON);
songSchema.plugin(paginate);

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
