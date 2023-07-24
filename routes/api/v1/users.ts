import { middleware, controller } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const UserController = controller("UserController");

// Endpoints for user data

router.use(middleware("verified"));

router.get("/", middleware("admin"), UserController.index);
router.delete("/:id", UserController.delete);
router.get("/:username", UserController.find);
router.put("/:id/make-admin", middleware("admin"), UserController.makeAdmin);

export default router;
