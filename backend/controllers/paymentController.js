const catchAsyncError = require('./../middlewares/catchAsyncError');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//*Process stripe payment  /api/v1/payment/process
exports.processToPayment = catchAsyncError(async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: 'usd',
    metadata: {
      integration_check: 'accept_a_payment',
    },
  });

  res.status(200).json({
    success: true,
    client_secret: paymentIntent.client_secret,
  });
});
//*send stripe api key /api/v1/stripeapi
exports.sendStripeApi = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    stripApiKey: process.env.STRIPE_API_KEY,
  });
});
