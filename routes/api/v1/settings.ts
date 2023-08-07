import { middleware, controller } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const SettingsController = controller("SettingsController");

// Endpoints for settings

router.route("/")
  .get(middleware("auth"), SettingsController.index)

router.post("/enable-2fa", middleware("auth"), SettingsController.enableTwoFactorAuth);

router.route("/app")
  .get(middleware(["auth", { roles: ["admin"] }]), SettingsController.getAppSettings)
  .put(middleware(["auth", { roles: ["admin"] }]), SettingsController.updateAppSettings);

export default router;