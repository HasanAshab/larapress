import { controller, middleware } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const AuthController = controller("AuthController");

// Endpoints to authenticate users

router.post("/register", middleware("recaptcha", ["limit", {time: 60 * 1000, count: 5}]), AuthController.register);
router.post("/login", middleware("recaptcha", ["limit", {time: 10 * 60 * 1000, count: 5}]), AuthController.login);

router.get("/login/google", AuthController.redirectToGoogle);
router.get("/google/callback", AuthController.loginWithGoogle);


router.post("/verify/resend", middleware(["limit", {time: 60 * 1000, count: 1}]), AuthController.resendEmailVerification);
router.get("/verify/:id", middleware("signed"), AuthController.verifyEmail);

router.post("/send-otp/:id", middleware(["limit", {time: 60 * 1000, count: 3}]), AuthController.sendOtp);

router.post("/password/forgot", middleware("recaptcha", ["limit", {time: 60 * 1000, count: 6}]), AuthController.forgotPassword);
router.put("/password/reset", AuthController.resetPassword);
router.put("/password/change", middleware("auth"), AuthController.changePassword);
 
router.route("/profile")
  .get(middleware("auth"), AuthController.profile)
  .put(middleware("auth"), AuthController.updateProfile);

router.put("/change-phone-number", middleware("auth"), AuthController.changePhoneNumber);



export default router;
