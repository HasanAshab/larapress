import Router from "Router";
import NotificationController from "~/app/http/controllers/v1/NotificationController";

// Endpoints for notification

Router.group({
  controller: NotificationController,
  middleware: ["auth", "verified"]
}, () => {
  Router.get("/", "index");
  Router.get("/unread-count", "unreadCount");
  Router.post("/:id", "markAsRead");
  Router.delete("/:id", "delete");
});