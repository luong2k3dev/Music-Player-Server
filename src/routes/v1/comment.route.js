const express = require('express');
const { commentController } = require('../../controllers/index.controller');

const commentRouter = express.Router();

commentRouter
    .route('/')
    .get(commentController.getComments)
    .post(commentController.createComment);

commentRouter
    .route('/:commentId')
    .get(commentController.getComment)
    .put(commentController.updateComment)
    .delete(commentController.deleteComment);

commentRouter
    .route('/:songId/song-comments')
    .get(commentController.getCommentsBySongId);
commentRouter
    .route('/:userId/user-comments')
    .get(commentController.getCommentsByUserId);

module.exports = commentRouter;
