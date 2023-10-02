import { middleware } from "~/core/utils";
import express, { Router } from "express";
import UserController from "~/app/http/v1/controllers/UserController";

const router: Router = express.Router();
const userController = new UserController();

// Endpoints for user management

router.get("/", middleware("auth", "roles:admin"), userController.index);

router.route("/me")
  .get(middleware("auth", "verified"), userController.profile)
  .put(middleware("auth", "verified"), userController.updateProfile)
  .delete(middleware("auth", "verified"), userController.deleteAccount);

router.route("/:username")
  .get(middleware("auth", "verified"), userController.find)
  .delete(middleware("auth", "verified"), userController.delete)

router.put("/:username/make-admin", middleware("auth", "roles:admin"), userController.makeAdmin);

export default router;
