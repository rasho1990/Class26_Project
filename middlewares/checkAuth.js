const jwt = require('jsonwebtoken');
const HttpError = require('./../models/http-error');

// Custom middleware for Express to check authentication
const checkAuth = (req, res, next) => {
  if (req.method === 'OPTIONS') return next();
  try {
    // Only keep token
    const token = req.headers.authorization.split(' ')[1];

    // Check if there's a token received from client headers
    if (!token) {
      throw new Error('Error at authentication!');
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // If token is verified add to request logged in user data
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError('Authentication failed! Log in again.', 403);
    next(error);
  }

  return;
};

module.exports = checkAuth;
