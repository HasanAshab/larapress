import { middleware, controller } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const SettingsController = controller("SettingsController");

// Endpoints for settings

router.route("/")
  .get(middleware("verified"), SettingsController.index)
 // .put(middleware("verified"), SettingsController.update);

router.post("/enable-2fa", middleware("verified"), SettingsController.enableTwoFactorAuth);

router.route("/app")
  .get(middleware("admin"), SettingsController.getAppSettings)
  .put(middleware("admin"), SettingsController.updateAppSettings);

export default router;
