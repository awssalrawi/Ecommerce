const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');
const cloudinary = require('cloudinary').v2;

//*handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error : ${err.message}`);
  console.log('Shutting down due to uncaught exception');
  process.exit(1);
});

//*Setting up config file
dotenv.config({ path: 'backend/config/config.env' });

//!setting up cloudinary config
cloudinary.config = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
};

//*Connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});

//*handle unhandled Promise rejection ..example:when you write wrong data in config.env

process.on('unhandledRejection', (err) => {
  console.log(`Error : ${err.message}`);
  console.log('closing connection due to unhandled Promise rejection');
  server.close(() => process.exit(1));
});
