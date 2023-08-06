import { middleware, controller } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const DashboardController = controller("DashboardController");

// Endpoints for dashboard

router.get("/admin", middleware(["auth", { roles: ["admin"] }]), DashboardController.admin);

export default router;
