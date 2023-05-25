import { controller, middleware } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const MediaController = controller("MediaController");

// Endpoints for serving files
router.get("/:id", MediaController.index);


export default router;
