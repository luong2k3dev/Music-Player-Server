const { User, Token } = require('../models/index.model');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { tokenTypes } = require('../config/tokens');
const { tokenService, emailService } = require('../services/index.service');

const register = catchAsync(async (req, res) => {
    const newUser = req.body;
    const { username, password, email, firstName, lastName } = newUser;
    if (await User.isUsernameTaken(newUser.username)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
    }
    if (await User.isEmailTaken(newUser.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    const user = await User.create({
        username,
        password,
        email,
        firstName,
        lastName,
    });
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).json({ user, tokens });
});

const login = catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            'Incorrect username or password',
        );
    }
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.OK).json({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
    const refreshToken = tokenService.extractTokenFromHeader(req);
    const refreshTokenDoc = await Token.findOne({
        token: refreshToken,
        type: tokenTypes.REFRESH,
    });
    if (!refreshTokenDoc) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
    await refreshTokenDoc.deleteOne();
    res.status(httpStatus.NO_CONTENT).json({ message: 'Logout success' });
});

const refreshTokens = catchAsync(async (req, res) => {
    const refreshToken = tokenService.extractTokenFromHeader(req);
    const refreshTokenDoc = await tokenService.verifyToken(
        refreshToken,
        tokenTypes.REFRESH,
    );
    const user = await User.findOne({ _id: refreshTokenDoc.user });
    if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
    }
    await refreshTokenDoc.deleteOne();
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.OK).json({ tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
    const { email } = req.body;
    const resetPasswordToken = await tokenService.generateResetPasswordToken(
        email,
    );
    await emailService.sendResetPasswordEmail(email, resetPasswordToken);
    res.status(httpStatus.OK).json({
        message: 'Please check your mailbox to confirm the password change',
    });
});

const resetPassword = catchAsync(async (req, res) => {
    const resetPasswordToken = req.query.token;
    const newPassword = req.body.password;
    const resetPasswordTokenDoc = await tokenService.verifyToken(
        resetPasswordToken,
        tokenTypes.RESET_PASSWORD,
    );
    const user = await User.findOne({ _id: resetPasswordTokenDoc.user });
    if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
    }
    user.password = newPassword;
    await user.save();
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
    res.status(httpStatus.OK).json({
        message: 'Password reset successfully',
    });
});

const sendVerificationEmail = catchAsync(async (req, res) => {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(
        req.user,
    );
    await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
    res.status(httpStatus.OK).json({
        message: 'Please check your mailbox to verify your account',
    });
});

const verifyEmail = catchAsync(async (req, res) => {
    const verifyEmailToken = req.query.token;
    const verifyEmailTokenDoc = await tokenService.verifyToken(
        verifyEmailToken,
        tokenTypes.VERIFY_EMAIL,
    );
    const user = await User.findOne({ _id: verifyEmailTokenDoc.user });
    if (!user) {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            'Email verification failed',
        );
    }
    user.isEmailVerified = true;
    await user.save();
    res.status(httpStatus.OK).json({
        message: 'Verify email successfully',
    });
});

module.exports = {
    register,
    login,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
    sendVerificationEmail,
    verifyEmail,
};
