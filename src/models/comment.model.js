const mongoose = require('mongoose');

const { toJSON } = require('./plugins/index.plugin');

const commentSchema = mongoose.Schema(
    {
        song: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Song',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        createAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestimestamp: true },
);

commentSchema.plugin(toJSON);

const Comment = mongoose.model('Comment ', commentSchema);

module.exports = Comment;
