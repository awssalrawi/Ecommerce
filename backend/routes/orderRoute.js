const express = require("express");
const router = express.Router();
const auth = require("./../middlewares/auth");
const orderController = require("./../controllers/orderController");

router
  .route("/order/new")
  .post(auth.isAuthenticatedUser, orderController.newOrder);
router
  .route("/order/:id")
  .get(auth.isAuthenticatedUser, orderController.getSingleOrder);
router
  .route("/orders/me")
  .get(auth.isAuthenticatedUser, orderController.myOrder);
router
  .route("/admin/orders")
  .get(
    auth.isAuthenticatedUser,
    auth.authorizedRoles("admin"),
    orderController.getAllOrders
  );
router
  .route("/admin/order/:id")
  .put(
    auth.isAuthenticatedUser,
    auth.authorizedRoles("admin"),
    orderController.updateOrderByAdmin
  )
  .delete(
    auth.isAuthenticatedUser,
    auth.authorizedRoles("admin"),
    orderController.deleteOrderByAdmin
  );
module.exports = router;
