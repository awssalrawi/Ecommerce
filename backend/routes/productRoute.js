const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

router.route("/products").get(productController.getProduct);
router.route("/product/new").post(productController.createNewProduct);
router.route("/product/:id").get(productController.getSingleProduct);
//.patch(productController.updateProduct);
router
  .route("/admin/product/:id")
  .put(productController.updateProduct)
  .delete(productController.deleteProduct);
module.exports = router;
//!PUT is a method of modifying resource where the client sends data that updates the entire resource . PATCH is a method of modifying resources where the client sends partial data that is to be updated without modifying the entire data.
