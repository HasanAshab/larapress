import { middleware, controller } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const SettingsController = controller("SettingsController");

// Endpoints for settings

router.get("/", middleware("auth", "verified"), SettingsController.index);
router.post("/setup-2fa", middleware("auth", "verified"), SettingsController.setupTwoFactorAuth);
router.put("/notification", middleware("auth", "verified"), SettingsController.notification);

router.route("/app")
  .get(middleware("auth", "roles:admin"), SettingsController.getAppSettings)
  .put(middleware("auth", "roles:admin"), SettingsController.updateAppSettings);
  //.get(SettingsController.getAppSettings)
  //.put(SettingsController.updateAppSettings);
 
export default router;