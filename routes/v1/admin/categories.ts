import { middleware } from "helpers";
import express, { Router } from "express";
import CategoryController from "~/app/http/v1/controllers/CategoryController";

const router: Router = express.Router();
const categoryController = new CategoryController();

// Endpoints for category management

//router.use(middleware("auth", "roles:admin"));

router.route("/")
  .get(categoryController.index)
  .post(categoryController.create);

router.route("/:id")
  .get(categoryController.find)
  .put(categoryController.update)
  .delete(categoryController.delete);

export default router;
