import { middleware } from "~/core/utils";
import express, { Router } from "express";
import NotificationController from "~/app/http/v1/controllers/NotificationController";

const router: Router = express.Router();
const notificationController = NotificationController.handlers();

// Endpoints for notification

router.use(middleware("auth", "verified"));

router.get("/", notificationController.index);
router.get("/unread-count", notificationController.unreadCount);
router.route("/:id")
  .post(notificationController.markAsRead)
  .delete(notificationController.delete);

export default router;
