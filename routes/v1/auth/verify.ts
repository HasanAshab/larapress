import { controller, middleware } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const AuthController = controller("AuthController");

// Endpoints to authenticate users

router.post("/resend", middleware("limit:60000,1"), AuthController.resendEmailVerification);
router.get("/:id", middleware("signed"), AuthController.verifyEmail);


export default router;