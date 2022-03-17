const Product = require("./../models/productModel");
const ErrorHandler = require("./../utils/errorHandler");
const catchAsyncError = require("./../middlewares/catchAsyncError");
const ApiFeatures = require("./../utils/apiFeatures");
const res = require("express/lib/response");

//*Create a new product /api/v1/product/new
exports.createNewProduct = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id; //! this is for user inside productSchema
  const product = await Product.create(req.body);
  res.status(201).json({
    //* 201 created
    success: true,
    product,
  });
});
//!get All Products  /api/v1/products
exports.getProduct = catchAsyncError(async (req, res, next) => {
  const resPerPage = 10;
  const productCount = await Product.countDocuments();

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);
  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    count: products.length,
    products,
    productCount,
  });
});

//!get a single product /api/v1/product/:id
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});
//!update Product /api/v1/admin/product/:id
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("product not found", 404));
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

//!delete Product /api/v1/admin/product/:id

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "There is no product with id that you entered",
    });
  }
  await Product.deleteOne();

  // res.status(204).json({
  //   //204 : no content
  // })
  res.status(200).json({
    success: true,
    message: "Product has deleted successfully",
  });
});
//* Create ne review =>api/v1/review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user.id,
    name: req.user.name,
    rating,
    comment,
  };
  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user.id.toString()
  );
  //console.log("11", product.reviews[0].user.toString());
  console.log("22", req.user.id);
  // console.log(isReviewed);
  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user.id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.numOfReviews;

  //console.log(product.reviews);
  await product.save({
    validateBeforeSave: false,
  });

  res.status(200).json({
    success: true,
  });
});
//*Get Product Reviews => /api/v1/reviews
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});
//*delete Product Review => /api/v1/reviews
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  const reviews = product.reviews.filter(
    (review) => review.id.toString() !== req.query.id.toString()
  );

  const numOfReviews = reviews.length;
  const ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews;

  await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews, ratings, numOfReviews },
    { new: true, runValidators: true, useFindAndModify: false }
  );
  console.log("reviews", reviews);
  console.log("query", req.query);

  res.status(200).json({
    success: true,
    product,
  });
});
