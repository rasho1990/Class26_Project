const express = require("express");
const { check } = require("express-validator");
const friendsControllers = require("../controllers/friend-controllers");
const friendRouter = express.Router();

friendRouter.post('/',friendsControllers.getfriends)

friendRouter.post("/add",
    [check("userId").not().isEmpty(), check("friendId").not().isEmpty()],
    friendsControllers.createFriendRequest
);

friendRouter.patch("/requests/accept",
    [check("userId").not().isEmpty(), check("friendId").not().isEmpty()],
    friendsControllers.acceptFriendRequest
);

friendRouter.patch("/requests/reject",
    [check("userId").not().isEmpty(), check("friendId").not().isEmpty()],
    friendsControllers.rejectFriendRequest
);

friendRouter.post("/delete",
    [check("userId").not().isEmpty(), check("friendId").not().isEmpty()],
    friendsControllers.deleteFriend
);

module.exports = friendRouter;