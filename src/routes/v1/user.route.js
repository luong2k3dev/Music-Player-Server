const express = require('express');
const { userController } = require('../../controllers/index.controller');
const { uploadService } = require('../../services/index.service');

const userRouter = express.Router();

const { auth, authorize } = require('../../middlewares/auth');

// profile
userRouter.route('/profile').get(auth, userController.getUser);

// favorite
userRouter.route('/favorite-songs').get(auth, userController.getFavoriteSongs);
userRouter
    .route('/favorite-songs/:songId')
    .post(auth, userController.addSongToFavorite)
    .delete(auth, userController.deleteSongFromFavorite);

// playlist
userRouter
    .route('/playlists')
    .get(auth, userController.getPlaylists)
    .post(auth, userController.createPlaylist);
userRouter
    .route('/playlists/:playlistId')
    .get(auth, userController.getSongsFromPlaylist)
    .delete(auth, userController.deletePlaylist);
userRouter
    .route('/playlists/:playlistId/:songId')
    .post(auth, userController.addSongToPlaylist)
    .delete(auth, userController.deleteSongFromPlaylist);

// comment
userRouter.route('/comments').get(auth, userController.getComments);
userRouter
    .route('/comments/:songId')
    .get(auth, userController.getCommentsBySongId)
    .post(auth, userController.createComment);
userRouter
    .route('/remove-comments/:commentId')
    .delete(auth, userController.deleteComment);

// admin
userRouter
    .route('/')
    .get(auth, authorize(['admin']), userController.getUsers)
    .post(
        auth,
        authorize(['admin']),
        uploadService.uploadImage.single('avatar'),
        userController.createUser,
    );
userRouter
    .route('/:userId')
    .get(auth, userController.getUser)
    .put(
        auth,
        authorize(['admin']),
        uploadService.uploadImage.single('avatar'),
        userController.updateUser,
    )
    .delete(auth, authorize(['admin']), userController.deleteUser);

module.exports = userRouter;
