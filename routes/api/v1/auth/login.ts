import { controller, middleware } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const AuthController = controller("AuthController");

// Endpoints to authenticate users

router.post("/", middleware("recaptcha", "limit@time:600000|count:5"), AuthController.login);
router.get("/google", AuthController.redirectToGoogle);

export default router;
