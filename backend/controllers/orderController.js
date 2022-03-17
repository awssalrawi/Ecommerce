const Order = require("./../models/orderModel");
const Product = require("./../models/productModel");
const ErrorHandler = require("./../utils/errorHandler");
const catchAsyncError = require("./../middlewares/catchAsyncError");

//*Create a new order => /api/v1/order/new
exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user.id,
  });
  res.status(201).json({
    success: true,
    order,
  });
});
//* Get single order  => /api/v1/order/:id

exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHandler("There is no order with this id ", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});
//* Get logged in user order  => /api/v1/orders/me

exports.myOrder = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });

  //   if (!orders) {
  //     return next(new ErrorHandler("There is no order with this id ", 404));
  //   }
  res.status(200).json({
    success: true,
    orders,
  });
});
//* Get all orders by admin order => /api/v1/admin/orders
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();

  //   if (!orders) {
  //     return next(new ErrorHandler("There is no order with this id ", 404));
  //   }
  let totalAmount = 0;

  orders.forEach((order) => (totalAmount += order.totalPrice));
  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

//*update / Process order ADMIN /api/v1/admin/order/:id
exports.updateOrderByAdmin = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (order.orderStatus === "Delivered") {
    return next(
      new ErrorHandler("you have already delivered this order ", 400)
    );
  }
  order.orderItems.forEach(async (item) => {
    await updateStock(item.product, item.quantity);
  });

  order.orderStatus = req.body.status;
  order.deliveredAt = Date.now();
  await order.save();

  res.status(200).json({
    success: true,
    order,
  });
});

async function updateStock(id, ItemQuantity) {
  const product = await Product.findById(id);
  product.stock = product.stock - ItemQuantity;

  await product.save();
}
//*Delete order => /api/v1/admin/order/:id
exports.deleteOrderByAdmin = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("There is no order with this id ", 404));
  }
  await order.remove();
  res.status(200).json({
    success: true,
  });
});
