import { controller, middleware } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const FileController = controller("FileController");

// Endpoints for serving files
router.get("/:id", middleware("signed"), FileController.index);

export default router;
