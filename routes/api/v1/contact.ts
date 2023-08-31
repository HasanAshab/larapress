import { middleware, controller } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const Controller = controller("ContactController");

// Endpoints for contact

router.get("/", Controller.index);


export default router;
