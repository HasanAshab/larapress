import { middleware, controller } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const UserController = controller("UserController");

// Endpoints for user data

router.get("/", middleware(["auth", { roles: ["admin"] }]), UserController.index);
router.delete("/:id", middleware("auth"), UserController.delete);
router.get("/:username", middleware("auth"), UserController.find);
router.put("/:id/make-admin", middleware(["auth", { roles: ["admin"] }]), UserController.makeAdmin);

export default router;
