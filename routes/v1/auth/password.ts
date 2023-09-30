import { middleware } from "helpers";
import express, { Router } from "express";
import AuthController from "~/app/http/v1/controllers/AuthController";

const router: Router = express.Router();
const authController = new AuthController();

// Endpoints to authenticate users

router.post("/reset/send-email", middleware("recaptcha", "limit:10000,2"), authController.sendResetPasswordEmail);
router.put("/reset", authController.resetPassword);
router.put("/change", middleware("auth", "verified"), authController.changePassword);

export default router;
