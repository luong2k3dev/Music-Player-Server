const mongoose = require('mongoose');

const { toJSON, paginate } = require('./plugins/index.plugin');

const singerSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default:
                'https://res.cloudinary.com/dzlxu2dlv/image/upload/v1690137208/Music-Player-App/Default/udkvvt29jubb6ixhidbd.jpg',
        },
        detail: {
            type: String,
        },
        country: {
            type: String,
            default: 'Việt Nam',
        },
    },
    { timestamps: true },
);

singerSchema.plugin(toJSON);
singerSchema.plugin(paginate);

const Singer = mongoose.model('Singer', singerSchema);

module.exports = Singer;
