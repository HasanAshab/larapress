import { controller, middleware } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const AuthController = controller("AuthController");

// Endpoints to authenticate users

router.post("/register", middleware("limit:60000,1", "recaptcha"), AuthController.register);
router.get("/callback/google", AuthController.loginWithGoogle);
router.post("/send-otp", middleware("limit:60000,3"), AuthController.sendOtp);
router.put("/change-phone-number", middleware("auth", "verified"), AuthController.changePhoneNumber);
router.post("/generate-recovery-codes", middleware("limit:60000,3", "auth", "verified"), AuthController.generateRecoveryCodes);

export default router;
