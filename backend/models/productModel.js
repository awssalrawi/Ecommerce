const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product must have a name "],
    trim: true,
    maxLength: [100, "Product name must be at most 100 characters"],
  },

  price: {
    type: Number,
    required: [true, "Price can't be empty"],
    maxLength: [5, "Price  must be at most 5 number"],
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, "Please enter a product description"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: [true, "Product must have an image"],
      },
      url: {
        type: String,
        required: [true, "please input the url"],
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please select category for this product"],
    enum: {
      values: [
        "Electronics",
        "Cameras",
        "Laptops",
        "Accessories",
        "Headphones",
        "Food",
        "Books",
        "Clothes",
        "Beauty",
        "Sports",
        "Outdoor",
        "Home",
      ],
      message: "Please select correct category for your product",
    },
  },

  seller: {
    type: String,
    required: [true, "Please enter product seller"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter the product stock"],
    maxLength: [5, "Product stock cannot exceed 5 characters"],
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", productSchema);
