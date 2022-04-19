const express = require('express');
const router = express.Router();
const { isAuthenticatedUser } = require('../middlewares/auth');
const paymentController = require('./../controllers/paymentController');

router
  .route('/payment/process')
  .post(isAuthenticatedUser, paymentController.processToPayment);

router
  .route('/stripeapi')
  .get(isAuthenticatedUser, paymentController.sendStripeApi);
module.exports = router;
