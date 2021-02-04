const multer = require('multer');
const cloudinary = require('../util/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'PlaceYourShare/images',
    allowed_formats: ['jpeg', 'jpg', 'png'],
  },
});

const fileUpload = multer({ storage: storage });

module.exports = fileUpload;