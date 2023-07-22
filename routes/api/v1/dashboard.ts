import { middleware, controller } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const DashboardController = controller("DashboardController");

// Endpoints for dashboard

router.use(middleware("auth"));
//router.get("/dashboard", AdminController.dashboard);

export default router;
