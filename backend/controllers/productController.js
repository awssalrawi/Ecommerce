const Product = require("./../models/productModel");
const ErrorHandler = require("./../utils/errorHandler");
const catchAsyncError = require("./../middlewares/catchAsyncError");
const ApiFeatures = require("./../utils/apiFeatures");
//*Create a new product /api/v1/product/new
exports.createNewProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    //* 201 created
    success: true,
    product,
  });
});
//!get All Products  /api/v1/products
exports.getProduct = catchAsyncError(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();
  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    count: products.length,
    products,
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

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "There is no product with id that you entered",
    });
  }
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
