const express = require('express');
const { songController } = require('../../controllers/index.controller');
const { uploadService } = require('../../services/index.service');

const songRouter = express.Router();

const { auth, authorize } = require('../../middlewares/auth');

songRouter
    .route('/')
    .get(auth, songController.getSongs)
    .post(
        auth,
        authorize(['admin']),
        uploadService.uploadAudio.single('filePath'),
        songController.createSong,
    );

songRouter
    .route('/:songId')
    .get(auth, songController.getSong)
    .put(auth, authorize(['admin']), songController.updateSong)
    .delete(auth, authorize(['admin']), songController.deleteSong);

songRouter
    .route('/:songId/listen')
    .post(auth, songController.incrementCountListen);
songRouter
    .route('/:songId/like')
    .post(auth, songController.incrementLikeNumber);
songRouter
    .route('/:songId/dislike')
    .post(auth, songController.incrementDislikeNumber);

module.exports = songRouter;
