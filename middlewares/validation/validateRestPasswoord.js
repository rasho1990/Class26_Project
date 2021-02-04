const { check } = require('express-validator');

const resetPasswordValidator = [
  check('newPassword').not().isEmpty().isLength({ min: 6 }),
];

module.exports = resetPasswordValidator;
