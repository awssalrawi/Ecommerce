//*Create and send token and save in the cookie.
const sendToken = (user, statusCode, res) => {
  //*Create jwt token
  const token = user.getJwtToken();
  //*Options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, //!if not httpOnly that mean it can be access by js code
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};

module.exports = sendToken;
