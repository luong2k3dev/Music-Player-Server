const express = require('express');
const { authController } = require('../../controllers/index.controller');
const { auth } = require('../../middlewares/auth');

const authRouter = express.Router();

authRouter.route('/register').post(authController.register);
authRouter.route('/login').post(authController.login);
authRouter.route('/logout').post(authController.logout);
authRouter.route('/refresh-tokens').post(authController.refreshTokens);
authRouter.route('/forgot-password').post(authController.forgotPassword);
authRouter.route('/reset-password').post(authController.resetPassword);
authRouter
    .route('/send-verification-email')
    .post(auth, authController.sendVerificationEmail);
authRouter.route('/verify-email').post(authController.verifyEmail);
authRouter.route('/forgot-password-otp').post(authController.forgotPasswordOTP);
authRouter.route('/verify-otp').post(authController.verifyOTP);
authRouter.route('/reset-password-otp').post(authController.resetPasswordOTP);

module.exports = authRouter;
