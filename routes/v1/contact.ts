import { middleware } from "helpers";
import express, { Router } from "express";
import ContactController from "~/app/http/v1/controllers/ContactController";

const router: Router = express.Router();
const contactController = new ContactController();

// Endpoints for contact

router.post("/", contactController.create);
router.use(middleware("auth", "roles:admin"));
router.get("/inquiries", contactController.index);
router.get("/inquiries/search", contactController.search);
router.route("/inquiries/:id")
  .get(contactController.find)
  .delete(contactController.delete);
router.put("/inquiries/:id/status", contactController.updateStatus);

export default router;
