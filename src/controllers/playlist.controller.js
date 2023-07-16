const { Playlist, Song } = require('../models/index.model');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');

const createPlaylist = catchAsync(async (req, res) => {
    const newPlaylist = req.body;
    const playlist = Playlist.findOne({ title: newPlaylist.title });
    if (playlist) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Playlist already exists');
    }
    const playlistCreated = await Playlist.create(newPlaylist);
    res.status(httpStatus.CREATED).json({ playlistCreated });
});

const getPlaylist = catchAsync(async (req, res) => {
    const { playlistId } = req.params;
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Playlist not found!');
    }
    res.status(httpStatus.OK).json({ playlist });
});

const getPlaylists = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['title']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
    const playlists = await Playlist.paginate(filter, options);
    res.status(httpStatus.OK).json({ playlists });
});

const updatePlaylist = catchAsync(async (req, res) => {
    const { playlistId } = req.params;
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Playlist not found!');
    }
    const { title } = req.body;
    if (title) {
        const existingPlaylist = await Playlist.findOne({
            title,
            _id: { $ne: playlistId },
        });
        if (existingPlaylist) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Playlist already exists',
            );
        }
    }
    Object.assign(playlist, req.body);
    const updatePlaylist = await playlist.save();
    res.status(httpStatus.OK).json({ updatePlaylist });
});

const deletePlaylist = catchAsync(async (req, res) => {
    const { playlistId } = req.params;
    const deletePlaylist = await Playlist.findById(playlistId);
    if (!deletePlaylist)
        throw new ApiError(httpStatus.NOT_FOUND, 'Playlist not found!');
    await deletePlaylist.deleteOne();
    res.status(httpStatus.OK).json({ deletePlaylist });
});

const getSongsFromPlaylist = catchAsync(async (req, res) => {
    const { playlistId } = req.params;
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Playlist not found!');
    }
    const songs = await Song.find({ _id: { $in: playlist.songs } });
    res.status(httpStatus.OK).json({ songs });
});

const addSongToPlaylist = catchAsync(async (req, res) => {
    const { playlistId } = req.params;
    const { songId } = req.body;
    const playlist = await Playlist.findById(playlistId);
    const song = await Song.findById(songId);
    if (!playlist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Playlist not found!');
    }
    if (!song) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Song not found!');
    }
    if (playlist.songs.includes(songId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Song already in playlist!');
    }
    playlist.songs.push(songId);
    await playlist.save();
    res.status(httpStatus.OK).json({
        message: 'Song added to the playlist successfully!',
    });
});

const deleteSongFromPlaylist = catchAsync(async (req, res) => {
    const { playlistId } = req.params;
    const { songId } = req.body;
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Playlist not found!');
    }
    if (!playlist.songs.includes(songId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Song not in playlist!');
    }
    playlist.songs.pull(songId);
    await playlist.save();
    res.status(httpStatus.OK).json({
        message: 'Song removed from the playlist successfully!',
    });
});

module.exports = {
    createPlaylist,
    getPlaylist,
    getPlaylists,
    updatePlaylist,
    deletePlaylist,
    getSongsFromPlaylist,
    addSongToPlaylist,
    deleteSongFromPlaylist,
};
