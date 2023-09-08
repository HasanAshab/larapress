import { controller, middleware } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const AuthController = controller("AuthController");

// Endpoints to authenticate users

router.post("/reset/send-email", middleware("recaptcha", "limit:10000,1"), AuthController.sendResetPasswordEmail);
router.put("/reset", AuthController.resetPassword);
router.put("/change", middleware("auth", "verified"), AuthController.changePassword);


export default router;
