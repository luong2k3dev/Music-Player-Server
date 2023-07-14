const express = require('express');
const userRoute = require('./user.route');
const authRoute = require('./auth.route');
const songRoute = require('./song.route');
const singerRoute = require('./singer.route');
const albumRoute = require('./album.route');
const playlistRoute = require('./playlist.route');
const commentRoute = require('./comment.route');

const router = express.Router();

const routes = [
    {
        path: '/users',
        route: userRoute,
    },
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/songs',
        route: songRoute,
    },
    {
        path: '/singers',
        route: singerRoute,
    },
    // {
    //     path: '/albums',
    //     route: albumRoute,
    // },
    // {
    //     path: '/playlists',
    //     route: playlistRoute,
    // },
    // {
    //     path: '/comments',
    //     route: commentRoute,
    // },
];

routes.map((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
