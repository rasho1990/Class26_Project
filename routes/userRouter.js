const express = require("express");
const uploadFile = require("./../middlewares/uploadFile");
const checkAuth = require("./../middlewares/checkAuth");
const userRouter = express.Router();

// Controllers


const { getAllUsers } = require("./../controllers/users-controllers");
const { createUser } = require("./../controllers/users-controllers");
const { logUserIn } = require("./../controllers/users-controllers");
const { getUserById } = require("./../controllers/users-controllers");
const { updateAccount } = require("./../controllers/users-controllers");
const { deleteAccount } = require("./../controllers/users-controllers");

const {
  getBucketList,
  addToBucketList,
  deleteFromBucketList,
} = require("./../controllers/bucketlist-controllers");

// Validators
const validateSignup = require("./../middlewares/validation/validateSignup");
const validateUpdateAccount = require("./../middlewares/validation/validateUpdateAccount");

// Public routes
userRouter.route("/").get(getAllUsers);

userRouter
  .route("/signup")
  .get((req, res) => res.json({ msg: "GET signup route found!" }))
  .post(uploadFile.single("image"), validateSignup, createUser);
userRouter.route("/login").post(logUserIn);

// change account settings feature
//////////////////////////////////////
// Middleware checks for authentication
userRouter.use(checkAuth);


userRouter.route('/').get(getAllUsers);


// Private routes
userRouter.route("/account/:userId").get(getUserById);

userRouter
  .route("/account/:userId")
  .patch(uploadFile.single("image"), validateUpdateAccount, updateAccount)
  .delete(deleteAccount);

//BucketList_Routes
userRouter.get("/bucketlist/:uid", getBucketList);
userRouter.use(checkAuth);
userRouter.route("/bucketlist/:pid").patch(addToBucketList);
userRouter.route("/bucketlist/:pid").delete(deleteFromBucketList);

module.exports = userRouter;
