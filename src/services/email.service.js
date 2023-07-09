const nodemailer = require('nodemailer');
const config = require('../config/config');

const transport = nodemailer.createTransport(config.email.smtp);
transport
    .verify()
    .then(() => console.log('Connected to email server'))
    .catch(() => console.log('Connect to email server failed'));

const sendEmail = async (to, subject, html) => {
    const msg = { from: config.email.from, to, subject, html };
    await transport.sendMail(msg);
};

const sendResetPasswordEmail = async (to, token) => {
    const subject = 'Reset password';
    const resetPasswordUrl = `http://localhost:3000/v1/auth/reset-password?token=${token}`;
    const html = `<p><b style="color:blue">Dear music player user</b><br><i>To reset your password, click on this link: ${resetPasswordUrl}<br>If you did not request any password resets, then ignore this email.</i></p>`;
    await sendEmail(to, subject, html);
};

const sendVerificationEmail = async (to, token) => {
    const subject = 'Email Verification';
    // replace this url with the link to the email verification page of your front-end app
    const verificationEmailUrl = `http://localhost:3000/v1/auth/verify-email?token=${token}`;
    const html = `<p><b style="color:blue">Dear music player user</b><br><i>To verify your email, click on this link: ${verificationEmailUrl}<br>If you did not create an account, then ignore this email.</i></p>`;
    await sendEmail(to, subject, html);
};

module.exports = {
    transport,
    sendEmail,
    sendResetPasswordEmail,
    sendVerificationEmail,
};
