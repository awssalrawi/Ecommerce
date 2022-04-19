const express = require('express');
const app = express();
const errorMiddleware = require('./middlewares/middleware');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
dotenv.config({ path: 'backend/config/config.env' });
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(fileUpload());

//*Import all routes
const products = require('./routes/productRoute');
const auth = require('./routes/authRoute');
const order = require('./routes/orderRoute');
const payment = require('./routes/payment');
app.use('/api/v1', products);
app.use('/api/v1', auth);
app.use('/api/v1', order);
app.use('/api/v1', payment);

//*Middleware to handle errors
app.use(errorMiddleware);
module.exports = app;
