const express = require('express');
const { singerController } = require('../../controllers/index.controller');
const { uploadService } = require('../../services/index.service');

const singerRouter = express.Router();

const { auth, authorize } = require('../../middlewares/auth');

singerRouter
    .route('/')
    .get(auth, singerController.getSingers)
    .post(
        auth,
        authorize(['admin']),
        uploadService.uploadImage.single('image'),
        singerController.createSinger,
    );

singerRouter
    .route('/:singerId')
    .get(auth, singerController.getSinger)
    .put(auth, authorize(['admin']), singerController.updateSinger)
    .delete(auth, authorize(['admin']), singerController.deleteSinger);

singerRouter
    .route('/:singerId/songs')
    .get(auth, singerController.getSongsBySingerId);
singerRouter
    .route('/:singerId/albums')
    .get(auth, singerController.getAlbumsBySingerId);

module.exports = singerRouter;
