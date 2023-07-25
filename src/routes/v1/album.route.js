const express = require('express');
const { albumController } = require('../../controllers/index.controller');
const { uploadService } = require('../../services/index.service');

const albumRouter = express.Router();

const { auth, authorize } = require('../../middlewares/auth');

albumRouter
    .route('/')
    .get(auth, albumController.getAlbums)
    .post(
        auth,
        authorize(['admin']),
        uploadService.uploadImage.single('image'),
        albumController.createAlbum,
    );

albumRouter
    .route('/:albumId')
    .get(auth, albumController.getAlbum)
    .put(auth, authorize(['admin']), albumController.updateAlbum)
    .delete(auth, authorize(['admin']), albumController.deleteAlbum);

albumRouter
    .route('/:albumId/songs')
    .get(auth, albumController.getSongsFromAlbum);

albumRouter
    .route('/:albumId/singers')
    .get(auth, albumController.getSingersFromAlbum);

albumRouter
    .route('/:albumId/:songId')
    .post(auth, authorize(['admin']), albumController.addSongToAlbum)
    .delete(auth, authorize(['admin']), albumController.deleteSongFromAlbum);

module.exports = albumRouter;
