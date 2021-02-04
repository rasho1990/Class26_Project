const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
	date: { type: Date, required: true },
	userId: { type: String, required: true },
	comment: { type: String, required: true, minlength: 5 },
	placeId: { type: String, required: true },
	creator: { name: String, image: String },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
