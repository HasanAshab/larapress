import { middleware } from "helpers";
import express, { Router } from "express";
import AuthController from "~/app/http/v1/controllers/AuthController";

const router: Router = express.Router();
const authController = new AuthController();

// Endpoints to verify users

router.post("/resend", middleware("limit:60000,1"), authController.resendEmailVerification);
router.get("/:id", middleware("signed"), authController.verifyEmail);


export default router;
