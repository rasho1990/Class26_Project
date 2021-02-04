const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  resetLink: { type: String, default: '' },
  friends: [{ type: Object, required: true }],
  requestslist: [{ type: Object, required: true }],
  newsfeed: [{ type: Object, required: true }],
  image: { type: String, required: true },
  places: [
    {
      type: mongoose.Types.ObjectId, // Id of related model
      required: true,

      ref: 'Place',
    },
  ],
  bucketList: [
    {
      id: { type: mongoose.Types.ObjectId, required: true, ref: 'Place' },
      _id: false,
      createdUser: { type: String },
    },
  ],
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

module.exports = User;
