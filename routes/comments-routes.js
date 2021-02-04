const express = require("express");
const { check } = require("express-validator");

const commentsController = require("../controllers/comments-controllers");

const router = express.Router();

router.get("/:pid", commentsController.getCommentsByPlaceId);

router.post(
	"/newComment",
	[check("comment").isLength({ min: 5 })],
	commentsController.createComment
);

router.delete("/:commentId/:userId", commentsController.deleteComment);

router.patch(
	"/:commentId",
	[check("comment").isLength({ min: 5 })],
	commentsController.updateComment
);
module.exports = router;
