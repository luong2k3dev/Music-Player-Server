const mongoose = require('mongoose');

const { toJSON } = require('./plugins/index.plugin');

const singerSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
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

const Singer = mongoose.model('Singer', singerSchema);

module.exports = Singer;
