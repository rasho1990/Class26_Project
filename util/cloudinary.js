const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dihduxpqa',
  api_key: '267645882412517',
  api_secret: process.env.CLOUDINARY_SECRET,
});

module.exports = cloudinary;