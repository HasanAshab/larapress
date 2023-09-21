import { controller, middleware } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const AuthController = controller("AuthController");

// Endpoints to authenticate users

router.post("/", middleware("recaptcha"), AuthController.login);
router.post("/recovery-code", middleware("recaptcha"), AuthController.loginWithRecoveryCode);
router.get("/google", AuthController.redirectToGoogle);

export default router;
