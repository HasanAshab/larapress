import { controller, middleware } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const AuthController = controller("AuthController");

// Endpoints to authenticate users

router.post("/register", middleware("recaptcha", ["limit", {time: 60 * 1000, count: 5}]), AuthController.register);

router.get("/callback/google", AuthController.loginWithGoogle);

router.post("/send-otp/:id", middleware(["limit", {time: 60 * 1000, count: 3}]), AuthController.sendOtp);

router.route("/profile")
  .get(middleware("auth"), AuthController.profile)
  .put(middleware("auth"), AuthController.updateProfile);

router.put("/change-phone-number", middleware("auth"), AuthController.changePhoneNumber);



export default router;
