const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const config = require('../config/config');

cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret,
});

const storage_image = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Music-Player-App/Image',
        resource_type: 'image',
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const storage_audio = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Music-Player-App/Audio/',
        resource_type: 'video',
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const delete_image = (imagePath) => {
    const publicId =
        'Music-Player-App/Image/' +
        imagePath.substring(
            imagePath.lastIndexOf('/') + 1,
            imagePath.lastIndexOf('.'),
        );
    cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
            console.error('Error deleting avatar from Cloudinary:', error);
        }
        console.log('Deleted avatar from Cloudinary:', result);
    });
};

const delete_audio = (audioPath) => {
    const publicId =
        'Music-Player-App/Audio/' +
        audioPath.substring(
            audioPath.lastIndexOf('/') + 1,
            audioPath.lastIndexOf('.'),
        );
    cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
            console.error('Error deleting audio from Cloudinary:', error);
        }
        console.log('Deleted audio from Cloudinary:', result);
    });
};

const uploadImage = multer({ storage: storage_image });
const uploadAudio = multer({ storage: storage_audio });

module.exports = { uploadImage, uploadAudio, delete_image, delete_audio };
