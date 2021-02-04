const { check } = require('express-validator');

const validateCreatePlace = [
	check('title')
		.not()
		.isEmpty(),
	check('description').isLength({ min: 5 }),
	check('address')
		.not()
		.isEmpty(),
];

module.exports = validateCreatePlace;
