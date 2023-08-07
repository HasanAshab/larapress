import { middleware, controller } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const SettingsController = controller("SettingsController");

// Endpoints for settings

router.post("/enable/:channel?", middleware("auth"), SettingsController.enableNotification);
router.post("/disable/:channel?", middleware("auth"), SettingsController.disableNotification);

export default router;
