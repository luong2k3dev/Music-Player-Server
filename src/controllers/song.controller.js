const Singer = require('../models/singer.model');
const Song = require('../models/song.model');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');

const createSong = catchAsync(async (req, res) => {
    const newSong = req.body;
    const { title, singer } = newSong;
    if (!title || !singer) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            'Title or Singer is required',
        );
    }
    const existSong = await Song.findOne({
        title: title.newSong,
        singer: singer.newSong,
    });
    if (existSong) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Song alreary is exist!');
    }
    const song = await Song.create(newSong);
    res.status(httpStatus.CREATED).json({ song });
});

const getSongs = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['title', 'genre']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
    const songs = await Song.paginate(filter, options);
    res.status(httpStatus.OK).json({ songs });
});

const getSong = catchAsync(async (req, res) => {
    const { songId } = req.params;
    const song = await Song.findById(songId);
    if (!song) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Song not found!');
    }
    res.status(httpStatus.OK).json({ song });
});

const updateSong = catchAsync(async (req, res) => {
    const updateSong = req.body;
    const { songId } = req.params;
    const song = await Song.findByIdAndUpdate(songId, updateSong, {
        new: true,
    });
    res.status(httpStatus.OK).json({ song });
});

const deleteSong = catchAsync(async (req, res) => {
    const { songId } = req.params;
    const song = await Song.findByIdAndDelete(songId);
    if (!song) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Song not found!');
    }
    res.status(httpStatus.OK);
});

module.exports = {
    createSong,
    getSong,
    getSongs,
    updateSong,
    deleteSong,
};
