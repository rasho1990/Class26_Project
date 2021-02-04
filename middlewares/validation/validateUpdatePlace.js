const { check } = require('express-validator');

const validateUpdatePlace = [
	check('title')
		.not()
		.isEmpty(),
	check('description').isLength({ min: 3 }),
];

module.exports = validateUpdatePlace;
