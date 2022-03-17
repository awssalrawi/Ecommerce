const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; //internal server error
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }
  if (process.env.NODE_ENV === "PRODUCTION") {
    // err.message = err.message || "Internal Server Error please try again later";

    let error = { ...err };
    error.message = err.message;
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid: ${error.path} `;
      error = new ErrorHandler(message, 400); //*bad request
    }
    //*Handling mongoose ValidationError
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map(
        (obj, index) => ` error ${index + 1} : ${obj.message} `
      );
      console.log(message);
      error = new ErrorHandler(message, 400);
    }
    //*handling mongoose duplicated error
    if (err.code === 11000) {
      // const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      const message = ` ${err.keyValue.email} is already registered if you have forgot your password please check the link below`;
      //  console.log(message);
      error = new ErrorHandler(message, 400);
    }

    //*handling wrong jwt error
    if (err.name === "JsonWebTokenError") {
      const message = "Json web token invalid . Try again!";
      error = new ErrorHandler(message, 400);
    }
    //*handling expire jwt error
    if (err.name === "TokenExpiredError") {
      const message = "Json web token Expired";
      error = new ErrorHandler(message, 400);
    }
    res.status(error.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error please try again later",
    });
  }
};
