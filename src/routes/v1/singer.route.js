const express = require('express');

const {
    getSingers,
    getSinger,
    createSinger,
    updateSinger,
    deleteSinger,
} = require('../../controllers/singer.controller');

const authMiddleware = require('../../middlewares/auth');
const singerRouter = express.Router();

singerRouter.route('/').get(getSingers).post(createSinger);

singerRouter
    .route('/:singerId')
    .get(getSinger)
    .put(updateSinger)
    .delete(deleteSinger);

module.exports = singerRouter;
