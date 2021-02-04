const { check } = require("express-validator");

const validateUpdateAccount = [
  check("name").isLength({ min: 3 }),
  check("email").isEmail(),
  check("password").isAlphanumeric(),
];

module.exports = validateUpdateAccount;
