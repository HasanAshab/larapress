import { middleware } from "~/core/utils";
import express, { Router } from "express";
import SettingsController from "~/app/http/v1/controllers/SettingsController";

const router: Router = express.Router();
const settingsController = new SettingsController();

// Endpoints for settings

router.get("/", middleware("auth", "verified"), settingsController.index);
router.post("/setup-2fa", middleware("auth", "verified"), settingsController.setupTwoFactorAuth);

router.put("/notification", middleware("auth", "verified"), settingsController.notification);

router.route("/app")
  //.get(middleware("auth", "roles:admin"), settingsController.getAppSettings)
  //.put(middleware("auth", "roles:admin"), settingsController.updateAppSettings)
  .get(settingsController.getAppSettings)
  .put(settingsController.updateAppSettings);
 
export default router;