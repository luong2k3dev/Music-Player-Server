const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const config = require('../config/config');
const { tokenService } = require('../services/index.service');

const auth = catchAsync(async (req, res, next) => {
    const token = tokenService.extractTokenFromHeader(req);
    if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
    }
    const payload = jwt.verify(token, config.jwt.secret);
    const user = await User.findOne({ _id: payload.sub });
    if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
    }
    console.log(user);
    req.user = user;
    next();
});

const authorize = (rolesAllow) => (req, res, next) => {
    if (!rolesAllow.includes(req.user.role)) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
    }
    next();
};

module.exports = {
    auth,
    authorize,
};
