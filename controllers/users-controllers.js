const uuid = require('uuid');
const fs = require('fs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const HttpError = require('./../models/http-error');
const User = require('./../models/User');
const Place = require('./../models/Place');

const hashPassword = require('./../util/hashPassword');
const comparePassword = require('./../util/comparePassword');

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    const searchValue = req.query.search;
    if (searchValue) {
      const inputValue = new RegExp(`${searchValue}`, 'gi');
      users = await User.find(
        { $or: [{ name: inputValue }, { email: inputValue }] },
        '-password'
      );
      res.status(200).json({
        users: users.map((user) => user.toObject({ getters: true })),
      });
    } else {
      users = await User.find({}, '-password');
      // Respond with users in JS format
      const modifiedUsers = users.map((user) =>
        user.toObject({ getters: true })
      );
      res.status(200).json(modifiedUsers);
    }
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
};
// const getUserById = async (req, res, next) => {
//   const { userId } = req.params;
//   let foundUser;
//   try {
//     foundUser = await User.findById(userId);
//   } catch (err) {
//     const error = new HttpError(
//       'Something went wrong, could not find place.',
//       500
//     );
//     return next(error);
//   }
//   if (!foundUser) {
//     const error = new HttpError(
//       'Could not find a place with the provided place ID!',
//       404
//     );
//     return next(error);
//   }
//   // Make "id" property available
//   const modifiedUser = foundUser.toObject({ getters: true });
//   return res.status(200).json(modifiedUser);
// };
const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError('Make sure to pass in the correct data!', 422);
    return next(error);
  }
  const { name, email, password } = req.body;
  const { path } = req.file;

  let emailExists;
  try {
    // Check if email already exists
    emailExists = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not create user!',
      500
    );
    return next(error);
  }

  if (emailExists) {
    const error = new HttpError(
      'Email already exists, please login instead!',
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    // Hash password
    hashedPassword = await hashPassword(password);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not create user!',
      500
    );
    return next(error);
  }

  if (!hashedPassword || hashedPassword === password) {
    const error = new HttpError(
      'Something went wrong, could not hash password!',
      500
    );
    return next(error);
  }

  // Create new user
  const newUser = new User({
    name,
    email,
    image: path,
    password: hashedPassword,
    places: [],
  });

  let token;
  try {
    // Save user
    await newUser.save();

    // Create an authentication token
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not create user!',
      500
    );
    return next(error);
  }

  const modifiedUser = newUser.toObject({ getters: true });

  res
    .status(201)
    .json({ userId: modifiedUser.id, email: modifiedUser.email, token });
};

const logUserIn = async (req, res, next) => {
  const { email, password } = req.body;

  let identifiedUser;
  let isPasswordCorrect;
  try {
    // Check if user exists
    identifiedUser = await User.findOne({ email });
    isPasswordCorrect = await comparePassword(
      password,
      identifiedUser.password
    );
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, check your credentials and try again!',
      500
    );
    return next(error);
  }

  if (!identifiedUser || !isPasswordCorrect) {
    const error = new HttpError('Credentials are incorrect!', 403);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: identifiedUser.id, email: identifiedUser.email },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, check your credentials and try again!',
      500
    );
    return next(error);
  }

  const modifiedUser = identifiedUser.toObject({ getters: true });
  res
    .status(200)
    .json({ userId: modifiedUser.id, email: modifiedUser.email, token });
};

// get user by ID middleware
const getUserById = async (req, res, next) => {
  const { userId } = req.params;
  let foundUser;
  try {
    foundUser = await User.findById(userId).populate({
      path: 'places',
      ref: Place,
    });
    // .populate({ path: "places.creator", ref: User })
    // .populate({ path: "friends", ref: User });
  } catch (err) {
    console.log({ err });
    const error = new HttpError(
      'Something went wrong, could not find account.',
      500
    );
    return next(error);
  }
  if (!foundUser) {
    const error = new HttpError(
      'Could not find a account with the provided user ID!',
      404
    );
    return next(error);
  }
  // Make "id" property available
  const modifiedUser = foundUser.toObject({ getters: true });
  return res.status(200).json(modifiedUser);
};

// update account middleware
const updateAccount = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new HttpError('The input is incorrect!');
    return next(error);
  }

  // allow name, email, password and image to be updated
  const { name, email, password } = req.body;

  const { userId } = req.params;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update this account.',
      500
    );
    return next(error);
  }

  if (user.id.toString() !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to edit this account!',
      401
    );
    next(error);
  }

  user.name = name;
  user.email = email;

  // if account password changed, hash new password
  let isPasswordChanged = await comparePassword(password, user.password);
  if (!isPasswordChanged) {
    user.password = await hashPassword(password);
  }

  // if account image changed
  if (req.file) {
    const { path } = req.file;
    let oldImagePath = user.image;
    user.image = path;
    // Removes old image from file system
    fs.unlink(oldImagePath, (err) => {
      console.log('Error in removing image from file system!', err);
    });
  }

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update account.',
      500
    );
    return next(error);
  }

  const modifiedUser = user.toObject({ getters: true });
  res.status(200).json(modifiedUser);
};

// delete account middleware
const deleteAccount = async (req, res, next) => {
  const { userId } = req.params;

  let user;
  try {
    user = await User.findById(userId); // Add User document
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete account.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('User does not exist!');
    return next(error);
  }

  if (user.id !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to delete this account!',
      401
    );
    next(error);
  }

  // Take path to remove account image from file system
  const imagePath = user.image;

  try {
    // delete all places which created by this user
    if (user.places.length > 0) {
      await user.places.map(async (placeId) => {
        foundPlace = await Place.findById(placeId);
        await foundPlace.remove();
      });
    }
    // delete this user from his friends list
    if (user.friends.length > 0) {
      await user.friends.map(async (friend) => {
        myFriend = await User.findById(friend.id);
        myFriend.friends = myFriend.friends.filter(
          (friend) => friend.id !== user.id
        );
        myFriend.newsfeed = myFriend.newsfeed.filter(u => {
          if (u.type === "Friends" && u.userId === myFriend.id && u.friendId === user.id)
              return false;
          return true;
        });
        await myFriend.save();
      });
    }
    // delete this user account
    await user.remove();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete account.',
      500
    );
    return next(error);
  }

  // Removes file from file system
  fs.unlink(imagePath, (err) => {
    console.log('Error in removing image from file system!', err);
  });

  res.status(200).json({ msg: 'Account successfully deleted!' });
};

exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.logUserIn = logUserIn;
exports.updateAccount = updateAccount;
exports.deleteAccount = deleteAccount;
