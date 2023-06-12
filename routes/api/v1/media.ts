import { controller, middleware } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const MediaController = controller("MediaController");

// Endpoints for serving files
router.get("/:id", middleware("signed"), MediaController.index);
router.get("/t/t", MediaController.t);


export default router;
