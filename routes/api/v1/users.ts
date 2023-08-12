import { middleware, controller } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const UserController = controller("UserController");

// Endpoints for user data

router.get("/", middleware(["auth", { roles: ["admin"] }]), UserController.index);

router.route("/me")
  .get(middleware("auth"), UserController.profile)
  .put(middleware("auth"), UserController.updateProfile);

router.route("/:username")
  .get(middleware("auth"), UserController.find)
  .delete(middleware("auth"), UserController.delete)
router.put("/:username/make-admin", middleware(["auth", { roles: ["admin"] }]), UserController.makeAdmin);

export default router;
