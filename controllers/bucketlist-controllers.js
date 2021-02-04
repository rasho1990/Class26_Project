const mongoose = require('mongoose');

const HttpError = require('./../models/http-error');
const Place = require('./../models/Place');
const User = require('./../models/User');

const getBucketList = async (req, res, next) => {
  const userId = req.params.uid;
  let bucketListUser;

  try {
    bucketListUser = await User.findById(userId).populate('bucketList.id');
    res.json({
      bucketListUser: bucketListUser.bucketList.toObject({
        getters: true,
      }),
    });
  } catch (error) {
    return next(
      new HttpError(
        'Something went wrong, could not find a place for the provided id.',
        500
      )
    );
  }
};

const addToBucketList = async (req, res, next) => {
  const placeId = req.params.pid;
  let bucketItem;
  try {
    bucketItem = await Place.findById(placeId).populate('creator');
    if (!bucketItem) {
      return next(
        new HttpError(`Could not find a place  for the provided place id.`, 404)
      );
    }
  } catch (error) {
    return next(
      new HttpError(
        'Something went wrong, could not find a place for the provided id.',
        500
      )
    );
  }

  const userId = await req.userData.userId;

  let currentUser;

  try {
    currentUser = await User.findById(userId);
  } catch (error) {
    return next(
      new HttpError(
        'Something went wrong, could not find a user for the provided id.',
        500
      )
    );
  }

  const createdBucketItem = {
    id: bucketItem.id,
    createdUser: bucketItem.creator.name,
    isVisited: false,
  };

  const nonUniqueArray = currentUser.bucketList.filter((item) => {
    return item.id == bucketItem.id;
  });

  const checkUnique = () => {
    if (nonUniqueArray.length > 0) {
      return false;
    } else {
      return true;
    }
  };

  const isUnique = checkUnique();

  if (!isUnique) {
    const error = new Error('Already exist in your Bucket List', 401);
    return next(error);
  }

  if (bucketItem.creator.id != req.userData.userId && isUnique) {
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      currentUser.bucketList.push(createdBucketItem);
      await currentUser.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      const error = new HttpError('Adding place failed, place try again.', 500);
      return next(error);
    }
  } else {
    const error = new Error(
      'You can not add your own places to you bucket list',
      401
    );
    return next(error);
  }
  res.json({
    newBucketPlace: bucketItem,
  });
};

const deleteFromBucketList = async (req, res, next) => {
  const placeId = req.params.pid;
  const userId = req.userData.userId;

  if (req.userData.userId == userId) {
    try {
      currentUser = await User.findById(userId);
      await currentUser.bucketList.pull({ id: placeId });
      await currentUser.save();
    } catch (error) {
      return next(new HttpError(`${error}`, 500));
    }
    res.status(200).json({ message: 'place deleted from bucket list' });
  } else {
    return next(new Error('You are not authorized to delete this place', 401));
  }
};

module.exports = {
  getBucketList,
  addToBucketList,
  deleteFromBucketList,
};
