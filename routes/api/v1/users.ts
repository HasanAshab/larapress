import { middleware, controller } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const UserController = controller("UserController");

// Endpoints for user data

router.get("/", middleware("auth", "roles:admin"), UserController.index);

router.route("/me")
  .get(middleware("auth", "verified"), UserController.profile)
  .put(middleware("auth", "verified"), UserController.updateProfile)
  .delete(middleware("auth", "verified"), UserController.deleteAccount);

router.route("/:username")
  .get(middleware("auth", "verified"), UserController.find)
  .delete(middleware("auth", "verified"), UserController.delete)

router.put("/:username/make-admin", middleware("auth", "roles:admin"), UserController.makeAdmin);

export default router;
