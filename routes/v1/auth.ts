import { middleware } from "~/core/utils";
import express from "express";
import AuthController from "~/app/http/v1/controllers/AuthController";

const router = express.Router();
const authController = AuthController.handlers();

/**
 * Endpoints to authenticate users
*/

//Router.get("/login", [AuthController, "login"]).middleware("limit:2000,2", "recaptcha").name("login");

// Login with various methods
router.post("/login", middleware("limit:2000,2", "recaptcha"), authController.login);
router.post("/login/recovery-code", middleware("limit:2000,1", "recaptcha"), authController.loginWithRecoveryCode);

// External login provided by Google, Facebook OAuth
router.get("/login/external/:provider(google|facebook)", authController.redirectToExternalLoginProvider);
router.get("/callback/:provider(google|facebook)", authController.loginWithExternalProvider);
router.post("/login/external/:provider(google|facebook)/final-step", authController.externalLoginFinalStep);

// User password management
router.post("/password/reset/send-email", middleware("recaptcha", "limit:10000,2"), authController.sendResetPasswordEmail);
router.put("/password/reset", authController.resetPassword);
router.put("/password/change", middleware("auth", "verified"), authController.changePassword);

// Verify user
router.post("/verify/resend", middleware("limit:60000,1"), authController.resendEmailVerification);
router.get("/verify/:id", middleware("signed"), authController.verifyEmail);

router.post("/register", middleware("limit:60000,1", "recaptcha"), authController.register);
router.post("/send-otp/:id", middleware("limit:60000,3"), authController.sendOtp);
router.put("/change-phone-number", middleware("auth", "verified"), authController.changePhoneNumber);
router.post("/generate-recovery-codes", middleware("limit:60000,3", "auth", "verified"), authController.generateRecoveryCodes);

export default router;
