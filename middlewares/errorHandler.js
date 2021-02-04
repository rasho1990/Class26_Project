const fs = require('fs');
const HttpError = require('./../models/http-error');

const errorHandler = (error, req, res, next) => {
  // If error in signup, remove image from file system
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    return next(error);
  }

  res
    .status(error.code || 500)
    .json({ msg: error.message || 'An unknown error occurred!' });
};

const errorNoRoute = (req, res, next) => {
  throw new HttpError('Could not find this route', 404);
};

exports.errorHandler = errorHandler;
exports.errorNoRoute = errorNoRoute;
