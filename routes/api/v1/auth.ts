import { controller, middleware } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const AuthController = controller("AuthController");

// Endpoints to authenticate users


router.get("/", (req, res) => {
  res.cookie("userId", "fooId");
  res.json("ok")
})

router.get("/a", (req, res) => {
  res.send(req.cookies)
})


router.post("/register", middleware(["limit", {time: 60 * 1000, count: 5}]), AuthController.register);
router.post("/login", middleware(["limit", {time: 10 * 60 * 1000, count: 5}]), AuthController.login);

router.get("/login/google", AuthController.redirectToGoogle);
router.get("/google/callback", AuthController.loginWithGoogle);


router.post("/verify/resend", middleware(["limit", {time: 60 * 1000, count: 1}]), AuthController.resendEmailVerification);
router.get("/verify/:id", middleware("signed"), AuthController.verifyEmail);

router.post("/send-otp/:id", middleware(["limit", {time: 60 * 1000, count: 3}]), AuthController.sendOtp);

router.post("/password/forgot", middleware(["limit", {time: 60 * 1000, count: 6}]), AuthController.forgotPassword);
router.put("/password/reset", AuthController.resetPassword);
router.put("/password/change", middleware("verified"), AuthController.changePassword);
 
router.route("/profile")
  .get(middleware("verified"), AuthController.profile)
  .put(middleware("verified"), AuthController.updateProfile);

router.put("/change-phone-number", middleware("verified"), AuthController.changePhoneNumber);



export default router;
