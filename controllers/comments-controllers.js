const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const User = require("../models/User");
const Place = require("../models/Place");

const HttpError = require("../models/http-error");
const Comment = require("../models/Comment");

//Create a new comment
const createComment = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new HttpError(".", 422));
	}

	const { date, comment, userId, placeId, commentId } = req.body;

	let user;
	try {
		user = await User.findById(userId);
	} catch (err) {
		const error = new HttpError("Creating comment failed, please try again.", 500);
		return next(error);
	}

	const newComment = new Comment({
		date,
		userId,
		comment,
		placeId,
		creator: user,
		commentId,
	});

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		// to push new comments into the newsfeed
		// user.newsfeed.push({
		// 	type: "comment",
		// 	userId,
		// 	placeId,
		// 	comment,
		// 	date,
		// });
		// await user.save({ session: sess });
		await newComment.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError("Creating comment failed, please try again.", 500);
		return next(error);
	}

	res.status(201).json({ comment: newComment });
};

//Get all comments of a place
const getCommentsByPlaceId = async (req, res, next) => {
	const placeId = req.params.pid;

	let placeWithComments;
	try {
		placeWithComments = await Comment.find({ placeId: placeId });
	} catch (err) {
		const error = new HttpError("Something went wrong, could not find comments.", 500);
		return next(error);
	}
	if (!placeWithComments) {
		const error = new HttpError("Could not find comments for the provided place.", 404);
		return next(error);
	}

	res.json({
		comments: placeWithComments.map(comment => comment.toObject({ getters: true })),
	});
};

//Update~Edit a comment
const updateComment = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new HttpError("Invalid inputs passed, please check your data.", 422));
	}

	const { comment } = req.body;
	const commentId = req.params.commentId;

	let commentToEdit;
	try {
		commentToEdit = await Comment.findById(commentId);
	} catch (err) {
		const error = new HttpError("Something went wrong, could not update comment.", 500);
		return next(error);
	}

	commentToEdit.comment = comment;

	try {
		await commentToEdit.save();
	} catch (err) {
		const error = new HttpError("Something went wrong, could not update comment.", 500);
		return next(error);
	}

	res.status(200).json({ comment: commentToEdit.toObject({ getters: true }) });
};

//Delete a comment
const deleteComment = async (req, res, next) => {
	const commentId = req.params.commentId;
	const userId = req.params.userId;

	let commentToDelete;

	try {
		commentToDelete = await Comment.findById(commentId);
	} catch (err) {
		const error = new HttpError("Something went wrong, could not delete comment.", 500);
		return next(error);
	}

	if (!commentToDelete) {
		const error = new HttpError("Could not find a comment for the provided id.", 404);
		return next(error);
	}

	if (commentToDelete.userId !== userId) {
		const error = new HttpError("You are not authorized to delete this comment.", 401);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await commentToDelete.remove({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError("Something went wrong, could not delete comment.", 500);
		return next(error);
	}

	res.status(200).json({ message: "Deleted comment." });
};

exports.createComment = createComment;
exports.getCommentsByPlaceId = getCommentsByPlaceId;
exports.updateComment = updateComment;
exports.deleteComment = deleteComment;
