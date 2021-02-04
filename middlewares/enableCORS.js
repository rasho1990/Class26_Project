const enableCORS = (req, res, next) => {
	// Allow any domain to send a request
	res.setHeader('Access-Control-Allow-Origin', '*');
	// Allows certain headers
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	// Allows only certain HTTP methods
	res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, POST, DELETE');

	next();
};

module.exports = enableCORS;
