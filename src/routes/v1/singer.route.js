const express = require('express');
const { singerController } = require('../../controllers/index.controller');

const singerRouter = express.Router();

singerRouter
    .route('/')
    .get(singerController.getSingers)
    .post(singerController.createSinger);

singerRouter
    .route('/:singerId')
    .get(singerController.getSinger)
    .put(singerController.updateSinger)
    .delete(singerController.deleteSinger);

singerRouter
    .route('/:singerId/all-songs')
    .get(singerController.getSongsBySingerId);
singerRouter
    .route('/:singerId/all-albums')
    .get(singerController.getAlbumsBySingerId);

module.exports = singerRouter;
