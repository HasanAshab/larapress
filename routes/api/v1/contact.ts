import { middleware, controller } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const ContactController = controller("ContactController");

// Endpoints for contact

router.get("/inquiries", middleware("auth@roles:admin"), ContactController.index);
router.post("/", middleware("auth"), ContactController.create);
router.route("/inquiries/:id")
  .get(middleware("auth@roles:admin"), ContactController.find)
  .delete(middleware("auth@roles:admin"), ContactController.delete);
router.put("/inquiries/search", middleware("auth@roles:admin"), ContactController.search);
/*router.put("/inquiries/:id/status", middleware("auth@roles:admin"), ContactController.updateStatus);
*/
export default router;
