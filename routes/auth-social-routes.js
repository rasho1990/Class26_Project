const express = require('express');

const authSocialRoutes = express.Router();

const authSocialController = require('../controllers/auth-social-controller.js');

authSocialRoutes.route('/googlelogin').post(authSocialController.googleLogin);
authSocialRoutes
  .route('/facebooklogin')
  .post(authSocialController.facebookLogin);

module.exports = authSocialRoutes;
