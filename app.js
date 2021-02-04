const path = require("path");
const express = require("express");
const app = express();
const connectDB = require("./util/connectDB");

const { errorHandler } = require("./middlewares/errorHandler");
const { errorNoRoute } = require("./middlewares/errorHandler");
const enableCORS = require("./middlewares/enableCORS");

// Routes
const placeRouter = require('./routes/placeRouter.js');
const userRouter = require('./routes/userRouter.js');
const authSocialRoutes = require('./routes/auth-social-routes.js');
const friendRouter = require('./routes/friends-routes');
const passwordRouter = require('./routes/passwordRouter');
const commentsRoutes = require('./routes/comments-routes');

// Middlewares
app.use(express.json());
app.use(enableCORS); // Only necessary if API is separate from client

// Whenever request hits this path, return static files
// Routes
app.use('/api/users', passwordRouter);
app.use('/api/authSocialMedia', authSocialRoutes);
app.use('/api/places', placeRouter);
app.use('/api/users', userRouter);
app.use('/api/friends', friendRouter);
app.use('/api/comments', commentsRoutes);
app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use(express.static('./frontend/build'));

// Any request that enters will be served the React app
app.use((req, res, next) => {
	res.sendFile(path.resolve(__dirname, './frontend/build', 'index.html'));
});
// middleware placed after routes to catch the error of not existing route
// app.use((req, res, next) => {
//   const error = new HttpError("Could not find this route", 404);
//   throw error;
// });

// error handling middleware
// In case of 4 arguments are existed, then express will recognize it as error handling
// This code will be executed every time getting error

// General error handling if route doesn't exist
app.use(errorNoRoute);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = () => {
	app.listen(PORT, () => {
		console.log(`Listening to port ${PORT}!`);
	});
};

connectDB(server);
