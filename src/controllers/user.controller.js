const { User, Song, Playlist } = require('../models/index.model');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');

const createUser = catchAsync(async (req, res) => {
    const newUser = req.body;
    if (await User.isUsernameTaken(newUser.username)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
    }
    if (await User.isEmailTaken(newUser.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    const user = await User.create(newUser);
    res.status(httpStatus.CREATED).json({ user });
});

const getUser = catchAsync(async (req, res) => {
    const userId = req.params.userId || req.user.id;
    const user = await User.findById(userId);
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
    res.status(httpStatus.OK).json({ user });
});

const getUsers = catchAsync(async (req, res) => {
    const filter = pick(req.query, [
        'username',
        'email',
        'firstName',
        'lastName',
        'role',
    ]);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
    const users = await User.paginate(filter, options);
    res.status(httpStatus.OK).json({ users });
});

const updateUser = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
    const userBody = req.body;

    if (userBody.username) {
        if (await User.isUsernameTaken(userBody.username, userId)) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Username already taken',
            );
        }
    }

    if (userBody.email) {
        if (await User.isEmailTaken(userBody.email, userId)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
        }
    }

    Object.assign(user, userBody);
    const updateUser = await user.save();
    res.status(httpStatus.OK).json({ updateUser });
});

const deleteUser = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
    await user.deleteOne();
    res.status(httpStatus.OK).json({ user });
});

const getFavoriteSongs = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const favoriteSongs = await Song.find({ _id: { $in: user.favoriteSongs } });
    res.status(httpStatus.OK).json({ favoriteSongs });
});

const addSongToFavorite = catchAsync(async (req, res) => {
    const { songId } = req.params;
    const song = await Song.findById(songId);
    if (!song) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Song not found!');
    }
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (user.favoriteSongs.includes(songId)) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            'Song already added to favorites!',
        );
    }
    user.favoriteSongs.push(songId);
    await user.save();
    res.status(httpStatus.OK).json({
        message: 'Song is already in the favorites!',
    });
});

const deleteSongFromFavorite = catchAsync(async (req, res) => {
    const { songId } = req.params;
    const song = await Song.findById(songId);
    if (!song) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Song not found!');
    }
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user.favoriteSongs.includes(songId)) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            'Song is not in the favorites!',
        );
    }
    user.favoriteSongs.pull(songId);
    await user.save();
    res.status(httpStatus.OK).json({
        message: 'Song removed from favorites successfully!',
    });
});

const getPlaylists = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const playlists = await Playlist.find({ createBy: userId });
    res.status(httpStatus.OK).json({ playlists });
});

const createPlaylist = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const { title } = req.body;
    const newPlaylist = new Playlist({
        title,
        createBy: userId,
    });
    await newPlaylist.save();
    res.status(httpStatus.OK).json({ newPlaylist });
});

const deletePlaylist = catchAsync(async (req, res) => {
    const { playlistId } = req.params;
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Playlist not found!');
    }
    const userId = req.user.id;
    if (playlist.createBy.toString() !== userId) {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            'You are not authorized to access this playlist!',
        );
    }
    await playlist.deleteOne();
    res.status(httpStatus.OK).json({
        message: 'Playlist deleted successfully',
    });
});

const getSongsFromPlaylist = catchAsync(async (req, res) => {
    const { playlistId } = req.params;
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Playlist not found!');
    }
    const userId = req.user.id;
    if (playlist.createBy.toString() !== userId) {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            'You are not authorized to access this playlist!',
        );
    }
    const songs = await Song.find({ _id: { $in: playlist.songs } });
    res.status(httpStatus.OK).json({ songs });
});

const addSongToPlaylist = catchAsync(async (req, res) => {
    const { playlistId, songId } = req.params;
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Playlist not found!');
    }
    const song = await Song.findById(songId);
    if (!song) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Song not found!');
    }
    const userId = req.user.id;
    if (playlist.createBy.toString() !== userId) {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            'You are not authorized to access this playlist!',
        );
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
    const { playlistId, songId } = req.params;
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Playlist not found!');
    }
    const song = await Song.findById(songId);
    if (!song) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Song not found!');
    }
    const userId = req.user.id;
    if (playlist.createBy.toString() !== userId) {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            'You are not authorized to access this playlist!',
        );
    }
    if (playlist.songs.includes(songId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Song already in playlist!');
    }
    playlist.songs.push(songId);
    await playlist.save();
    res.status(httpStatus.OK).json({
        message: 'Song added to the playlist successfully!',
    });
    if (!playlist.songs.includes(songId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Song not in playlist!');
    }
    playlist.songs.pull(songId);
    await playlist.save();
    res.status(httpStatus.OK).json({
        message: 'Song removed from the playlist successfully!',
    });
});

const getComments = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const comments = await Comment.find({ user: userId });
    res.status(200).json({ comments });
});

const createComment = catchAsync(async (req, res) => {
    const { songId } = req.params;
    const song = await Song.findById(songId);
    if (!song) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Song not found!');
    }
    const userId = req.user.id;
    const { comment } = req.body;
    const newComment = new Comment({
        song: songId,
        content: comment,
        createBy: userId,
    });
    await newComment.save();
    res.status(httpStatus.OK).json({ newComment });
});

const deleteComment = catchAsync(async (req, res) => {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found!');
    }
    const userId = req.user.id;
    if (comment.createBy.toString() !== userId) {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            'You are not authorized to access this comment!',
        );
    }
    await comment.deleteOne();
    res.status(httpStatus.OK).json({
        message: 'Comment deleted successfully',
    });
});

module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    getFavoriteSongs,
    addSongToFavorite,
    deleteSongFromFavorite,
    getPlaylists,
    createPlaylist,
    deletePlaylist,
    getSongsFromPlaylist,
    addSongToPlaylist,
    deleteSongFromPlaylist,
    getComments,
    createComment,
    deleteComment,
};
