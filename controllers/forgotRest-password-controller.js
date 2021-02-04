const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const mailgun = require('mailgun-js');
const _ = require('lodash');

const DOMAIN = process.env.DOMAIN_MAILGUN;
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });

const HttpError = require('./../models/http-error');
const User = require('./../models/User');
const hashPassword = require('./../util/hashPassword');

//forgot password controller
const forgotPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError('Make sure to pass in the correct data!', 422);
    return next(error);
  }

  const { email } = req.body;

  let identifiedUser;
  try {
    // Check if email exists
    identifiedUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, can not  find email!',
      500,
    );
    return next(error);
  }
  if (!identifiedUser) {
    const error = new HttpError('Email not exists!', 403);
    return next(error);
  }

  //generate token to send with email and restpassword
  let token;
  try {
    token = jwt.sign(
      { userId: identifiedUser.id },
      process.env.JWT_REST_PASSWORD,
      {
        expiresIn: '5h',
      },
    );
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, can not create email token  !',
      500,
    );
    return next(error);
  }

  //set email data
  const emailData = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Password Reset link`,
    html: `
                <h2>Please use the following link to reset your password</h2>
                <p>${process.env.CLIENT_URL}/reset-password/${token}</p>
                `,
  };

  try {
    //update user with new resetLink 'email token link
    await identifiedUser.updateOne({ resetLink: token });
  } catch (err) {
    const error = new HttpError('Something went wrong, cant update user!', 500);
    return next(error);
  }

  try {
    //send email
    await mg.messages().send(emailData);
    return res.json({
      message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
    });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong!, can not send email',
      500,
    );
    return next(error);
  }
};

//rest-password controller
const resetPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      '1 Make sure to pass in the correct data!',
      422,
    );
    return next(error);
  }

  const { resetLink, newPassword } = req.body;

  if (!resetLink) {
    const error = new HttpError('User with this token does not exist!', 403);
    return next(error);
  }

  try {
    // verify token
    jwt.verify(resetLink, process.env.JWT_REST_PASSWORD);
  } catch (err) {
    const error = new HttpError('Incorrect token or it is expired!', 500);
    return next(error);
  }

  let identifiedUser;
  try {
    // Check if token in link is exist in user model
    identifiedUser = await User.findOne({ resetLink });
  } catch (err) {
    const error = new HttpError('Incorrect token or it is expired!', 500);
    return next(error);
  }

  if (!identifiedUser) {
    const error = new HttpError('User with this token does not exist!', 403);
    return next(error);
  }
  //hash the new rest password
  let newHashedPassword;
  try {
    newHashedPassword = await hashPassword(newPassword);
  } catch {
    const error = new HttpError('Can not hash password!', 500);
    return next(error);
  }

  const updatedFields = {
    password: newHashedPassword,
    resetLink: '',
  };
  //user lodash to update user
  try {
    identifiedUser = _.extend(identifiedUser, updatedFields);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong,can not update user',
      500,
    );
    return next(error);
  }
  try {
    //save th update user in DB
    await identifiedUser.save();
    // Create an authentication token
    token = jwt.sign(
      { userId: identifiedUser.id, email: identifiedUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );
  } catch (err) {
    const error = new HttpError('Something went wrong,Cant save user', 500);
    return next(error);
  }

  const modifiedUser = identifiedUser.toObject({ getters: true });

  res.status(201).json({
    userId: modifiedUser.id,
    email: modifiedUser.email,
    token,
    message: `you'r login in with your new password`,
  });
};

exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
