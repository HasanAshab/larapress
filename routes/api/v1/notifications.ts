import Router from "~/core/http/routing/Router";
import NotificationController from "~/app/http/controllers/v1/NotificationController";

// Endpoints for notification

Router.group({
  controller: NotificationController,
  middlewares: ["auth", "verified"],
  as: "notification."
}, () => {
  Router.get("/", "index");
  Router.get("/:rawNotification", "show");
  Router.get("/unread-count", "unreadCount");
  Router.post("/:id", "markAsRead").name("markAsRead");
  Router.delete("/:id", "delete").name("delete");
});