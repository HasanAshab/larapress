import { middleware, controller } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const AdminController = controller("AdminController");

// Endpoints for admin

router.use(middleware("verified", "admin"));

/*
router.get("/dashboard", AdminController.dashboard);
router.route("/settings")
  .get(AdminController.getSettings)
  .put(AdminController.updateSettings);

*/

export default router;
