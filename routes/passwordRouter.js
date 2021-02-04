const express = require('express');

const passwordRouter = express.Router();

// Controllers
const {
  forgotPassword,
} = require('../controllers/forgotRest-password-controller');
const {
  resetPassword,
} = require('../controllers/forgotRest-password-controller');

// Validators
const forgotPasswordValidator = require('../middlewares/validation/validateforgetPassword');
const resetPasswordValidator = require('../middlewares/validation/validateRestPasswoord');

passwordRouter
  .route('/forgot-password')
  .put(forgotPasswordValidator, forgotPassword);
passwordRouter
  .route('/reset-password')
  .put(resetPasswordValidator, resetPassword);

module.exports = passwordRouter;
