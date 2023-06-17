import { controller, middleware } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const AuthController = controller("AuthController");

// Endpoints to authenticate users
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);


router.get("/verify", middleware("signed"), AuthController.verifyEmail);
router.post("/verify/resend", middleware("auth"), AuthController.resendEmailVerification);

router.post("/password/forgot", AuthController.forgotPassword);
router.put("/password/reset", AuthController.resetPassword);
router.put("/password/change", middleware("auth"), AuthController.changePassword);

router.route("/profile")
  .get(middleware("auth"), AuthController.profile)
  .put(middleware("auth"), AuthController.updateProfile);

export default router;
