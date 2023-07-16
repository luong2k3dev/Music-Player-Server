const mongoose = require('mongoose');

const { toJSON, paginate } = require('./plugins/index.plugin');

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
    { timestamps: true },
);

albumSchema.plugin(toJSON);
albumSchema.plugin(paginate);

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
