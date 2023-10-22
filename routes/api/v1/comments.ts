import { middleware } from "~/core/utils";
import express, { Router } from "express";

const router: Router = express.Router();
/*
const CommentController = controller("CommentController");
// Endpoints for comments
router.route("/:modelName/:id")
  .get(CommentController.index)
  //.post(CommentController.create);
router.route("/:id")
  .put(CommentController.update)
  .delete(CommentController.delete);
*/
export default router;
