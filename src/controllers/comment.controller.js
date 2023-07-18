const { Comment, Song, User } = require('../models/index.model');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');

const getComments = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['content']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
    const comments = await Comment.paginate(filter, options);
    res.status(httpStatus.OK).json({ comments });
});

const getComment = catchAsync(async (req, res) => {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId)
        .populate('song')
        .populate('user');
    if (!comment) {
        throw new ApiError(httpStatus.NOT_FOUND, 'comment not found!');
    }
    res.status(httpStatus.OK).json({ comment });
});

const createComment = catchAsync(async (req, res) => {
    const newcomment = req.body;
    const comment = await Comment.create(newcomment);
    res.status(httpStatus.CREATED).json({ comment });
});

const updateComment = catchAsync(async (req, res) => {
    const { commentId } = req.params;
    const newComment = req.body;
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found!');
    }
    const updateComment = await newComment.save();
    res.status(httpStatus.OK).json({ updateComment });
});

const deleteComment = catchAsync(async (req, res) => {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found!');
    }
    const deleteComment = await comment.deleteOne();
    res.status(httpStatus.OK).json({ deleteComment });
});

const getCommentsBySongId = catchAsync(async (req, res) => {
    const { songId } = req.params;
    const song = await Song.findById(songId);
    if (!song) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Song not found!');
    }
    const comments = await Comment.find({ song: songId })
        .populate('song')
        .populate('user');
    res.status(httpStatus.OK).json({ comments });
});

const getCommentsByUserId = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'user not found!');
    }
    const comments = await Comment.find({ user: userId })
        .populate('song')
        .populate('user');
    res.status(httpStatus.OK).json({ comments });
});

module.exports = {
    getComments,
    getComment,
    createComment,
    updateComment,
    deleteComment,
    getCommentsBySongId,
    getCommentsByUserId,
};
