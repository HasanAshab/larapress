import { middleware } from "helpers";
import express, { Router } from "express";
import DashboardController from "~/app/http/v1/controllers/DashboardController";

const router: Router = express.Router();
const dashboardController = new DashboardController();

// Endpoints for dashboard
router.get("/admin", middleware("auth", "roles:admin"), dashboardController.admin);

export default router;
