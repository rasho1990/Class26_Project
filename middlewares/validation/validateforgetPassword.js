const { check } = require('express-validator');
const forgotPasswordValidator = [check('email').not().isEmpty().isEmail()];

module.exports = forgotPasswordValidator;
