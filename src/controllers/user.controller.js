const { User } = require('../models/index.model');
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
    const { userId } = req.params;
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
    // console.log(filter);
    // console.log(options);
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

module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
};
