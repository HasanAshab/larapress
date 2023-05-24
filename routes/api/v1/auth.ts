import { middleware } from "helpers";

import { controller } from "helpers";
console.log(controller("AuthController"))

import express, { Router } from "express";
const router: Router = express.Router();
/*
import AuthController from "app/http/controllers/AuthController";

const router: Router = express.Router();


// Endpoints to authenticate users
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);


router.get("/verify", AuthController.verifyEmail);
router.post("/verify/resend", middleware("auth"), AuthController.resendEmailVerification);

router.post("/password/forgot", AuthController.forgotPassword);
router.put("/password/reset", AuthController.resetPassword);
router.put("/password/change", middleware("auth"), AuthController.changePassword);

router.route("/profile")
  .get(middleware("auth"), AuthController.profile)
  .put(middleware("auth"), AuthController.updateProfile);
*/
export default router;
