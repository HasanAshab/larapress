import { middleware } from "~/core/utils";
import express, { Router } from "express";
import DashboardController from "~/app/http/v1/controllers/DashboardController";
import CategoryController from "~/app/http/v1/controllers/CategoryController";



const router: Router = express.Router();
const dashboardController = DashboardController.handlers();
const categoryController = CategoryController.handlers();


router.use(middleware("auth", "roles:admin"));

// Admin dashboard
router.get("/dashboard", dashboardController.admin);

// Category management
router.route("/categories")
  .get(categoryController.index)
  .post(categoryController.create);
  
router.route("/categories/:id")
  .get(categoryController.find)
  .put(categoryController.update)
  .delete(categoryController.delete);

export default router;
