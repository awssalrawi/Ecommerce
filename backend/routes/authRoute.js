const express = require("express");
const router = express.Router();
const auth = require("./../middlewares/auth");
const authController = require("./../controllers/authController");
const { isAuthenticatedUser } = require("../middlewares/auth");
router.route("/register").post(authController.registerUser);
router.route("/login").post(authController.loginUser);
router.route("/logout").get(authController.logoutUser);
router.route("/password/forgot").post(authController.forgotPassword);
router.route("/password/reset/:token").put(authController.resetPassword);
router.route("/me").get(isAuthenticatedUser, authController.getUserProfile);
router
  .route("/me/update")
  .put(isAuthenticatedUser, authController.updateProfile);
router
  .route("/password/update")
  .put(isAuthenticatedUser, authController.updateProduct);
router
  .route("/admin/users")
  .get(
    isAuthenticatedUser,
    auth.authorizedRoles("admin"),
    authController.getAllUser
  );
router
  .route("/admin/user/:id")
  .get(
    isAuthenticatedUser,
    auth.authorizedRoles("admin"),
    authController.getUserDetails
  )
  .put(
    isAuthenticatedUser,
    auth.authorizedRoles("admin"),
    authController.updateUserByAdmin
  )
  .delete(
    isAuthenticatedUser,
    auth.authorizedRoles("admin"),
    authController.deleteUserByAdmin
  );

module.exports = router;
