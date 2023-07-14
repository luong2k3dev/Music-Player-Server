const express = require('express');
const { songController } = require('../../controllers/index.controller');
const songRouter = express.Router();

songRouter
    .route('/')
    .get(songController.getSongs)
    .post(songController.createSong);

songRouter
    .route('/:songId')
    .get(songController.getSong)
    .put(songController.updateSong)
    .delete(songController.deleteSong);

module.exports = songRouter;
