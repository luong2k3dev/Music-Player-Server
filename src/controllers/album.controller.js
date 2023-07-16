const { Album, Song, Singer } = require('../models/index.model');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');

const createAlbum = catchAsync(async (req, res) => {
    const newAlbum = req.body;
    const album = Album.findOne({ title: newAlbum.title });
    if (album) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Album already exists');
    }
    const albumCreated = await Album.create(newAlbum);
    res.status(httpStatus.CREATED).json({ albumCreated });
});

const getAlbum = catchAsync(async (req, res) => {
    const { albumId } = req.params;
    const album = await Album.findById(albumId);
    if (!album) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Album not found!');
    }
    res.status(httpStatus.OK).json({ album });
});

const getAlbums = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['title', 'releaseYear']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
    const albums = await Album.paginate(filter, options);
    res.status(httpStatus.OK).json({ albums });
});

const updateAlbum = catchAsync(async (req, res) => {
    const { albumId } = req.params;
    const album = await Album.findById(albumId);
    if (!album) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Album not found!');
    }
    const { title } = req.body;
    if (title) {
        const existingAlbum = await Album.findOne({
            title,
            _id: { $ne: albumId },
        });
        if (existingAlbum) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Album already exists');
        }
    }
    Object.assign(album, req.body);
    const updateAlbum = await album.save();
    res.status(httpStatus.OK).json({ updateAlbum });
});

const deleteAlbum = catchAsync(async (req, res) => {
    const { albumId } = req.params;
    const deleteAlbum = await Album.findById(albumId);
    if (!deleteAlbum)
        throw new ApiError(httpStatus.NOT_FOUND, 'Album not found!');
    await deleteAlbum.deleteOne();
    res.status(httpStatus.OK).json({ deleteAlbum });
});

const getSongsFromAlbum = catchAsync(async (req, res) => {
    const { albumId } = req.params;
    const album = await Album.findById(albumId);
    if (!album) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Album not found!');
    }
    const songs = await Song.find({ _id: { $in: album.songs } });
    res.status(httpStatus.OK).json({ songs });
});

const getSingersFromAlbum = catchAsync(async (req, res) => {
    const { albumId } = req.params;
    const album = await Album.findById(albumId);
    if (!album) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Album not found!');
    }
    const singers = await Singer.find({ _id: { $in: album.singers } });
    res.status(httpStatus.OK).json({ singers });
});

const addSongToAlbum = catchAsync(async (req, res) => {
    const { albumId } = req.params;
    const { songId } = req.body;
    const album = await Album.findById(albumId);
    const song = await Song.findById(songId);
    if (!album) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Album not found!');
    }
    if (!song) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Song not found!');
    }
    if (album.songs.includes(songId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Song already in album!');
    }
    album.songs.push(songId);
    await album.save();
    res.status(httpStatus.OK).json({
        message: 'Song added to the album successfully!',
    });
});

const deleteSongFromAlbum = catchAsync(async (req, res) => {
    const { albumId } = req.params;
    const { songId } = req.body;
    const album = await Album.findById(albumId);
    if (!album) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Album not found!');
    }
    if (!album.songs.includes(songId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Song not in album!');
    }
    album.songs.pull(songId);
    await album.save();
    res.status(httpStatus.OK).json({
        message: 'Song removed from the album successfully!',
    });
});

module.exports = {
    createAlbum,
    getAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    getSongsFromAlbum,
    getSingersFromAlbum,
    addSongToAlbum,
    deleteSongFromAlbum,
};
