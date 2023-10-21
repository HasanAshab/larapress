import { middleware } from "~/core/utils";
import express, { Router } from "express";
import ContactController from "~/app/http/v1/controllers/ContactController";

const router: Router = express.Router();
const contactController = ContactController.handlers();

// Endpoints for contact

router.post("/", contactController.create);
router.get("/inquiries", middleware("auth", "roles:admin"), contactController.index);
router.get("/inquiries/search", middleware("auth", "roles:admin"), contactController.search);
router.route("/inquiries/:id")
  .get(middleware("auth", "roles:admin"), contactController.show)
  .delete(middleware("auth", "roles:admin"), contactController.delete);
router.put("/inquiries/:id/status", middleware("auth", "roles:admin"), contactController.updateStatus);

export default router;
