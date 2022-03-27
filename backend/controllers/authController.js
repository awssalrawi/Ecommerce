const User = require('./../models/userModel');

const ErrorHandler = require('./../utils/errorHandler');
const catchAsyncError = require('./../middlewares/catchAsyncError');
const crypto = require('crypto');
const sendToken = require('./../utils/jwtToken');
const sendEmail = require('./../utils/sendEmail');
//*Register a user => /api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, password, email } = req.body;
  const user = await User.create({
    name,
    password,
    email,
    avatar: {
      public_id: 'avatar',
      url: 'https://gravatar.com/avatar/c3fc2b11598edc7f633b4ce8f4ac1897?s=400&d=robohash&r=x',
    },
  });

  // const token = user.getJwtToken();
  // console.log(token);
  // res.status(201).json({
  //   success: true,
  //   token,
  // });
  sendToken(user, 201, res);
});
//* Login User => /api/v1/login

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  //* Checks if email and password have entered by user
  if (!email || !password) {
    return next(new ErrorHandler('Please enter email & password', 400));
  }
  //* Finding user in database
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }
  //*check if password correct or not
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid email or password Iam here', 401));
  }
  // const token = user.getJwtToken();

  // res.status(200).json({
  //   success: true,
  //   token,
  // });
  sendToken(user, 200, res);
});
//*Logout user /api/v1/logout
exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie('token', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: 'Logged out successfully',
    });
});
//* Forgot password /api/v1/Password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new ErrorHandler('There is no user with that email address', 404)
    );
  }
  //*Send reset user
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  //*create password reset url  first we have to check the protocol if http or https
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is as follow \n\n${resetUrl} \n\n if you have not requested this email,please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'ShopIt forgotten password reset',
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email has sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined; //! because when is en error we do not want to save anything inside database
    await user.save({ validateBeforeSave: false });
    return new ErrorHandler(error.message, 500); // 500 : internal server error
  }
});
//* reset password /api/v1/Password/reset/:token
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  //*hash url sendToken
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  console.log(req.params.token);

  const user = await User.findOne({
    resetPasswordToken,
    // resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler('password reset token invalid or has been expired', 400)
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password does not match', 400));
  }
  //*Setup new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
}); //*Get currently logged in user details  /api/v1/me
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});
//*//* update password   api/v1/Password/update
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  //*Check previous user password
  const isMatched = await user.comparePassword(req.body.oldPassword);
  if (!isMatched) {
    return next(new ErrorHandler('Wrong current password', 400));
  }
  user.password = req.body.password;
  await user.save();
  sendToken(user, 200, res);
});
//* Update user profile  api/v1/me/update
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  //*update avatar profile
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
  });
});
//*Get all users =>/api/v1/admin/users
exports.getAllUser = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});
//*Get user details =>/api/v1/admin/user/:id
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`There is no user with this id : ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});
//*Update user Profile by admin  =>/api/v1/admin/user/:id
exports.updateUserByAdmin = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(
      new ErrorHandler(`There is no user with this id : ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});
//*Delete user by admin =>/api/v1/admin/user/:id
exports.deleteUserByAdmin = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`There is no user with this id : ${req.params.id}`, 404)
    );
  }
  //* Remove avatar from cloudinary server
  await user.remove();

  res.status(200).json({
    success: true,
  });
});
