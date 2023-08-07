const mongoose = require('mongoose');

const { toJSON } = require('./plugins/index.plugin');

const otpSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        otp: {
            type: String,
            required: true,
        },
        expiresIn: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true },
);

otpSchema.plugin(toJSON);

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
