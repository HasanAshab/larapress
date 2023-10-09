import { middleware } from "~/core/utils";
import express from "express";
import AuthController from "~/app/http/v1/controllers/AuthController";
import passport from 'passport';

const router = express.Router();
const authController = AuthController.handlers();

/**
 * Endpoints to authenticate users
*/

// Login with various methods
router.post("/login", middleware("limit:2000,2", "recaptcha"), authController.login);
router.post("/login/recovery-code", middleware("limit:2000,1", "recaptcha"), authController.loginWithRecoveryCode);
router.get("/login/google", passport.authenticate('google', { session: false, scope: ['openid', 'profile', 'email'] }));
//router.get("/login/google", authController.redirectToGoogle);

// User password management
router.post("/password/reset/send-email", middleware("recaptcha", "limit:10000,2"), authController.sendResetPasswordEmail);
router.put("/password/reset", authController.resetPassword);
router.put("/password/change", middleware("auth", "verified"), authController.changePassword);

// Verify user
router.post("/verify/resend", middleware("limit:60000,1"), authController.resendEmailVerification);
router.get("/verify/:id", middleware("signed"), authController.verifyEmail);

router.post("/register", middleware("limit:60000,1", "recaptcha"), authController.register);
router.get("/callback/google", passport.authenticate('google', { session: false }), authController.loginWithGoogle);
//router.get("/callback/google", authController.loginWithGoogle);
router.post("/send-otp/:id", middleware("limit:60000,3"), authController.sendOtp);
router.put("/change-phone-number", middleware("auth", "verified"), authController.changePhoneNumber);
router.post("/generate-recovery-codes", middleware("limit:60000,3", "auth", "verified"), authController.generateRecoveryCodes);

export default router;
