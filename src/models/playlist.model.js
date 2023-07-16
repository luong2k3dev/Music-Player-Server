const mongoose = require('mongoose');

const { toJSON, paginate } = require('./plugins/index.plugin');

const playlistSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        songs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Song',
            },
        ],
        createBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        createAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true },
);

playlistSchema.plugin(toJSON);
playlistSchema.plugin(paginate);

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
