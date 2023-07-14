const Singer = require('../models/singer.model');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');

const getSingers = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'country']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const singers = await Singer.paginate(filter, options);
    res.status(httpStatus.OK).json({ singers });
});

const getSinger = catchAsync(async (req, res) => {
    const { singerId } = req.params;
    const singer = await Singer.findById(singerId);
    if (!singer) throw new ApiError(httpStatus.NOT_FOUND, 'Singer not found!');
    res.status(httpStatus.OK).json({ singer });
});

const createSinger = catchAsync(async (req, res) => {
    const newSinger = req.body;
    const { name } = newSinger;
    if (!name) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Name is required');
    }
    const existingSinger = await Singer.findOne({ name: newSinger.name });
    if (existingSinger) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Singer already exist!');
    }
    const singer = await Singer.create(newSinger);
    res.status(httpStatus.CREATED).json({ singer });
});

const updateSinger = catchAsync(async (req, res) => {
    const { singerId } = req.params;
    const newSinger = req.body;
    const singer = await Singer.findByIdAndUpdate(singerId, newSinger, {
        new: true,
    });
    if (!singer) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Singer not found!');
    }
    res.status(httpStatus.OK).json({ singer });
});

const deleteSinger = catchAsync(async (req, res) => {
    const { singerId } = req.params;
    const singer = await Singer.findByIdAndDelete(singerId);
    if (!singer) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Singer not found!');
    }
    res.status(httpStatus.OK).json();
});

module.exports = {
    getSingers,
    getSinger,
    createSinger,
    updateSinger,
    deleteSinger,
};
