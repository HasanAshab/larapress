import { middleware, controller } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const SettingsController = controller("SettingsController");

// Endpoints for settings

router.post("/:operation(enable|disable)/:channel(email|push)?", middleware("auth"), SettingsController.notification);

export default router;
