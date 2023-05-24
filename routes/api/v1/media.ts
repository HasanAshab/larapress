import { middleware } from "helpers";
import express, { Router } from "express";
import MediaController from "app/http/controllers/MediaController";

const router: Router = express.Router();

// Endpoints for serving files
router.get("/:id", MediaController.index);


export default router;
