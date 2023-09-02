import { middleware, controller } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const CategoryController = controller("CategoryController");

// Endpoints for settings

router.use(middleware("auth@roles:admin"));

router.route("/")
  .get(CategoryController.index)
  .post(CategoryController.create);

router.route("/:id")
  .get(CategoryController.find)
  .put(CategoryController.update)
  .delete(CategoryController.delete);

export default router;
