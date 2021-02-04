const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('./../models/User');
const fetch = require('node-fetch');
const HttpError = require('./../models/http-error');

//google login controller
const googleLogin = async (req, res, next) => {
 
  const client = new OAuth2Client(process.env.GOOGLE_OATH);

  const { tokenId } = req.body;

  let response;
  try {
    //get google data
    response = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_OATH,
    });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, can not get google data!',
      500
    );
    return next(error);
  }

  const { email_verified, name, email } = await response.payload;
  //get email_verified from payload
  if (!email_verified) {
    const error = new HttpError(
      'Something went wrong, can not get user data!',
      500
    );
    return next(error);
  }

  let user;
  try {
    user = await User.findOne({ email }).exec({ email });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, not right credentials !',
      500
    );
    return next(error);
  }
  // Create an authentication token
  if (user) {
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    const { email, name } = user;
    
    //send back user info and token
    return res.json({
      token,
      user: { email, name },
      userId:user.id
    });
  } else {
    //if no user create user
    user = new User({
      name: response.payload.name,
      email: response.payload.email,
      image: response.payload.picture,
      password: response.payload.at_hash,
      places: [],
    });
    let userData;
    let token;
    try {
      // Save user
       await user.save();

      // Create an authentication token
      token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
    } catch (err) {
      const error = new HttpError(
        'Something went wrong,authentication not complit !',
        500
      );
      return next(error);
    }
    //convert document into a plain javascript object, ready for storage in MongoDB
    const modifiedUser = user.toObject({ getters: true });
    //send back token and user data
    
    res.status(200).json({
      userId: modifiedUser.id,
      email: modifiedUser.email,
      token,
    });
  }
};

//facebook login controller
const facebookLogin = async (req, res, next) => {
  const { id, accessToken } = req.body;
  const graphFbUrl = `https://graph.facebook.com/v2.11/${id}/?fields=id,name,email,picture&access_token=${accessToken}`;

  let Json;
  try {
    //get facebook data
    const response = await fetch(graphFbUrl, {
      method: 'GET',
    });
    Json = await response.json();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, can not get google data!',
      500
    );
    return next(error);
  }

  let { name, email, picture } = Json;

  let user;
  try {
    user = await User.findOne({ email }).exec({ email });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, not right credentials !',
      500
    );
    return next(error);
  }
  // Create an authentication token
  if (user) {
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    const { email, name,id } = user;
    //send back user info and token
    return res.json({
      token,
      userId:id,
    });
  } else {
    let password = email + process.env.JWT_SECRET;
    //if no user create user
    user = new User({
      name,
      email,
      image: picture.data.url,
      password,
      places: [],
    });
    let newUser;
    let token;
    try {
      // Save user
      newUser = await user.save();

      // Create an authentication token
      token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
    } catch (err) {
      const error = new HttpError(
        'Something went wrong,authentication not complit !',
        500
      );
      return next(error);
    }
    //convert document into a plain javascript object, ready for storage in MongoDB
    const modifiedUser = newUser.toObject({ getters: true });
    //send back token and user data
    res.status(200).json({
      userId: modifiedUser.id,
      email: modifiedUser.email,
      token,
    });
  }
};

exports.googleLogin = googleLogin;
exports.facebookLogin = facebookLogin;
