const express = require('express');
const { playlistController } = require('../../controllers/index.controller');

const playlistRouter = express.Router();

playlistRouter
    .route('/')
    .get(playlistController.getPlaylists)
    .post(playlistController.createPlaylist);

playlistRouter
    .route('/:playlistId')
    .get(playlistController.getPlaylist)
    .put(playlistController.updatePlaylist)
    .delete(playlistController.deletePlaylist);

playlistRouter
    .route('/:playlistId/all-songs')
    .get(playlistController.getSongsFromPlaylist);
playlistRouter
    .route('/:playlistId/add-song')
    .post(playlistController.addSongToPlaylist);
playlistRouter
    .route('/:playlistId/remove-song')
    .delete(playlistController.deleteSongFromPlaylist);

module.exports = playlistRouter;
