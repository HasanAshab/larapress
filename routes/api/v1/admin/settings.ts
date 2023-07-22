import { middleware, controller } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const SettingsController = controller("SettingsController");

// Endpoints for settings

router.use(middleware("auth", "admin"));

router.route("/")
  .get(SettingsController.index)
  .put(SettingsController.update);

export default router;
