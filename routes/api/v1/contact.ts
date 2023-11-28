import Router from "~/core/http/routing/Router";
import ContactController from "~/app/http/controllers/v1/ContactController";

// Endpoints for contact

Router.controller(ContactController).group(() => {
  Router.post("/", "store");
  
  Router.group({
    prefix: "/inquiries",
   // middlewares: ["auth", "roles:admin"]
  }, () => {
    Router.get("/", "index");
    Router.get("/:rawContact", "show");
    Router.delete("/:id", "delete");
    Router.patch("/:id/status", "updateStatus");
    Router.get("/search", "search");
  });
});