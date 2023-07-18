const express = require('express');
const { playlistController } = require('../../controllers/index.controller');

const playlistRouter = express.Router();

const { auth, authorize } = require('../../middlewares/auth');

playlistRouter
    .route('/')
    .get(auth, authorize(['admin']), playlistController.getPlaylists)
    .post(auth, authorize(['admin']), playlistController.createPlaylist);

playlistRouter
    .route('/:playlistId')
    .get(auth, authorize(['admin']), playlistController.getPlaylist)
    .put(auth, authorize(['admin']), playlistController.updatePlaylist)
    .delete(auth, authorize(['admin']), playlistController.deletePlaylist);

playlistRouter
    .route('/:playlistId/songs')
    .get(auth, authorize(['admin']), playlistController.getSongsFromPlaylist);

playlistRouter
    .route('/:playlistId/:songId')
    .post(auth, authorize(['admin']), playlistController.addSongToPlaylist)
    .delete(
        auth,
        authorize(['admin']),
        playlistController.deleteSongFromPlaylist,
    );

module.exports = playlistRouter;
