const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const { toJSON, paginate } = require('./plugins/index.plugin');

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email không hợp lệ');
                }
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
            validate(value) {
                if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                    throw new Error(
                        'Password must contain at least one letter and one number',
                    );
                }
            },
            private: true,
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        avatar: {
            type: String,
            default: 'https://static.dhcnhn.vn/student',
        },
        gender: {
            type: String,
            trim: true,
            enum: ['Nam', 'Nữ', 'Khác'],
            default: 'Khác',
        },
        dateOfBirth: {
            type: Date,
            default: '01-01-1970',
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        favoriteSongs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Song',
            },
        ],
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    { timestimestamp: true },
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema.virtual('fullName').get(() => {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.statics.isUsernameTaken = async function (username, excludeUserId) {
    const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
    return !!user;
};

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

userSchema.statics.isEmail = function (email) {
    return validator.isEmail(email);
};

userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
