const express = require('express');
const { commentController } = require('../../controllers/index.controller');

const commentRouter = express.Router();

const { auth, authorize } = require('../../middlewares/auth');

commentRouter
    .route('/')
    .get(auth, authorize(['admin']), commentController.getComments)
    .post(auth, authorize(['admin']), commentController.createComment);

commentRouter
    .route('/:commentId')
    .get(auth, authorize(['admin']), commentController.getComment)
    .put(auth, authorize(['admin']), commentController.updateComment)
    .delete(auth, authorize(['admin']), commentController.deleteComment);

commentRouter
    .route('/:songId/song-comments')
    .get(auth, authorize(['admin']), commentController.getCommentsBySongId);
commentRouter
    .route('/:userId/user-comments')
    .get(auth, authorize(['admin']), commentController.getCommentsByUserId);

module.exports = commentRouter;
