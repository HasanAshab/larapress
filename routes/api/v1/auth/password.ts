import { controller, middleware } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const AuthController = controller("AuthController");

// Endpoints to authenticate users

router.post("/reset/send-email", middleware("recaptcha", ["limit", {time: 60 * 1000, count: 6}]), AuthController.sendResetPasswordEmail);
router.put("/reset", AuthController.resetPassword);
router.put("/change", middleware("auth"), AuthController.changePassword);
 

export default router;
