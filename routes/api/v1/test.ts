import { controller, middleware } from "helpers";
import express from "express";


const router: express.Router = express.Router();
//const MediaController = controller("MediaController");

// Endpoints for serving files
router.get("/", (req, res) => {
  res.send("hola")
});


export default router;
