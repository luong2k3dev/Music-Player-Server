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
            default:
                'https://res.cloudinary.com/dzlxu2dlv/image/upload/v1690137412/Music-Player-App/Default/e9cka08aikh5vb2jzj9g.jpg',
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
