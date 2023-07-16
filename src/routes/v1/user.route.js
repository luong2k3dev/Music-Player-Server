const express = require('express');
const {
    userController,
    playlistController,
} = require('../../controllers/index.controller');

const userRouter = express.Router();

// admin
userRouter
    .route('/')
    .get(userController.getUsers)
    .post(userController.createUser);

userRouter
    .route('/:userId')
    .get(userController.getUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

// profile
userRouter.route('/profile').get(userController.getUser);

// favorites
userRouter.route('/all-favorite-songs').get(userController.getFavoriteSongs);
userRouter.route('/add-favorite-song').post(userController.addSongToFavorite);
userRouter
    .route('/remove-favorite-song')
    .delete(userController.deleteSongFromFavorite);

// playlists
userRouter.route('/all-playlists').get(userController.getPlaylists);
userRouter.route('/add-playlist').post(userController.createPlaylist);
userRouter
    .route('/remove-playlist/:playlistId')
    .delete(userController.deletePlaylist);
userRouter
    .route('/playlist-songs/:playlistId')
    .get(playlistController.getSongsFromPlaylist);
userRouter
    .route('/add-playlist-song/:playlistId/:songId')
    .post(playlistController.addSongToPlaylist);
userRouter
    .route('/remove-playlist-song/:playlistId/:songId')
    .delete(playlistController.deleteSongFromPlaylist);

// comments
userRouter.route('/all-comments').get(userController.getComments);
userRouter.route('/add-comment/:songId').post(userController.createComment);
userRouter
    .route('/remove-comment/:commentId')
    .delete(userController.deleteComment);

module.exports = userRouter;
