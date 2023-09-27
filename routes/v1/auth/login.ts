import { middleware } from "helpers";
import express, { Router } from "express";
import AuthController from "~/app/http/v1/controllers/AuthController";

const router: Router = express.Router();
const authController = new AuthController();
// Endpoints to login users

router.post("/", middleware("limit:2000,2"), authController.login);
router.post("/recovery-code", middleware("limit:2000,1", "recaptcha"), authController.loginWithRecoveryCode);
router.get("/google", authController.redirectToGoogle);

export default router;
