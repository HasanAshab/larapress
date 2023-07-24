import { middleware, controller } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const DashboardController = controller("DashboardController");

// Endpoints for dashboard

router.get("/", middleware("auth", "admin"), DashboardController.admin);

export default router;
