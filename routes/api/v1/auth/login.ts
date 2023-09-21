import { controller, middleware } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const AuthController = controller("AuthController");

// Endpoints to authenticate users

router.post("/", middleware("limit:2000,2", "recaptcha"), AuthController.login);
router.post("/recovery-code", middleware("limit:2000,1", "recaptcha"), AuthController.loginWithRecoveryCode);
router.get("/google", AuthController.redirectToGoogle);

export default router;
