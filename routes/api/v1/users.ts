import { middleware, controller } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const UserController = controller("UserController");

// Endpoints for user data

router.use(middleware("verified"));

router.get("/", middleware("admin"), UserController.index);
router.route("/:id")
  .get(UserController.find)
  .delete(UserController.delete);

//router.put("/:id/make-admin", middleware("admin"), UserController.makeAdmin);

export default router;
