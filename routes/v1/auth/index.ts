import { middleware } from "~/core/utils";
import express from "express";
import AuthController from "~/app/http/v1/controllers/AuthController";

const router = express.Router();
const authController = new AuthController();

// Endpoints to authenticate users
router.post("/", authController.test);
router.post("/register", middleware("limit:60000,1", "recaptcha"), authController.register);
router.get("/callback/google", authController.loginWithGoogle);
router.post("/send-otp/:id", middleware("limit:60000,3"), authController.sendOtp);
router.put("/change-phone-number", middleware("auth", "verified"), authController.changePhoneNumber);
router.post("/generate-recovery-codes", middleware("limit:60000,3", "auth", "verified"), authController.generateRecoveryCodes);

export default router;
