const express = require("express");
const auth = require("./../middlewares/auth");
const productController = require("../controllers/productController");
const router = express.Router();

router.route("/products").get(productController.getProduct);
router
  .route("/product/new")
  .post(
    auth.isAuthenticatedUser,
    auth.authorizedRoles("admin"),
    productController.createNewProduct
  );
router.route("/product/:id").get(productController.getSingleProduct);
//.patch(productController.updateProduct);
router
  .route("/admin/product/:id")
  .put(
    auth.isAuthenticatedUser,
    auth.authorizedRoles("admin"),
    productController.updateProduct
  )
  .delete(
    auth.isAuthenticatedUser,
    auth.authorizedRoles("admin"),
    productController.deleteProduct
  );

router
  .route("/review")
  .put(auth.isAuthenticatedUser, productController.createProductReview);
router
  .route("/reviews")
  .get(auth.isAuthenticatedUser, productController.getProductReviews);
router
  .route("/reviews")
  .delete(auth.isAuthenticatedUser, productController.deleteReview);

module.exports = router;

//!PUT is a method of modifying resource where the client sends data that updates the entire resource . PATCH is a method of modifying resources where the client sends partial data that is to be updated without modifying the entire data.
