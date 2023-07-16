const express = require('express');
const { albumController } = require('../../controllers/index.controller');

const albumRouter = express.Router();

albumRouter
    .route('/')
    .get(albumController.getAlbums)
    .post(albumController.createAlbum);

albumRouter
    .route('/:albumId')
    .get(albumController.getAlbum)
    .put(albumController.updateAlbum)
    .delete(albumController.deleteAlbum);

albumRouter.route('/:albumId/all-songs').get(albumController.getSongsFromAlbum);

albumRouter
    .route('/:albumId/all-singers')
    .get(albumController.getSingersFromAlbum);

albumRouter.route('/:albumId/add-song').post(albumController.addSongToAlbum);

albumRouter
    .route('/:albumId/remove-song')
    .delete(albumController.deleteSongFromAlbum);

module.exports = albumRouter;
