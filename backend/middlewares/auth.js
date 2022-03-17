const User = require("./../models/userModel");
const catchAsyncError = require("./../middlewares/catchAsyncError");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("./../utils/errorHandler");
//*Checks id user is authenticated or not authenticated

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please sign in first ", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
});
exports.authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`You don't have permission as a ${req.user.role}`, 403)
      );
    }
    next();
  };
};
