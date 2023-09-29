import { middleware, controller } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const ContactController = controller("ContactController");

// Endpoints for contact
//router.post("/", ContactController.create[0], middleware("sanitize:subject,message"), ContactController.create[1]);
router.use(middleware("auth", "roles:admin"));
router.get("/inquiries", ContactController.index);
router.get("/inquiries/search", ContactController.search);
router.route("/inquiries/:id")
  .get(ContactController.find)
  .delete(ContactController.delete);
router.put("/inquiries/:id/status", ContactController.updateStatus);

export default router;
