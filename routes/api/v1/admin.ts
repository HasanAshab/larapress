import { middleware, controller } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const AdminController = controller("AdminController");

// Endpoints for admin

router.use(middleware("verified", "admin"));

router.get("/users", AdminController.getUsers);
router.route("/users/:id")
  .get(AdminController.findUser)
  .put(AdminController.updateUser)
  .delete(AdminController.deleteUser);
/*
router.get("/categories", AdminController.getCategories);
router.route("/categories/:id")
  .get(AdminController.findCategory)
  .post(AdminController.createCategory)
  .put(AdminController.updateCategory)
  .delete(AdminController.deleteCategory);

router.route("settings")
  .get(AdminController.getSettings)
  .put(AdminController.updateSettings);

router.get("dashboard", AdminController.dashboard);
*/
export default router;
