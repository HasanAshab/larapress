import Router from "Router";
import ContactController from "~/app/http/v1/controllers/ContactController";

// Endpoints for contact

Router.controller(ContactController).group(() => {
  Router.post("/", "create");
  
  Router.group({
    prefix: "/inquiries",
    middlewares: ["auth", "roles:admin"]
  }, () => {
    Router.get("/", "index");
    Router.get("/:id", "show");
    Router.delete("/:id", "delete");
    Router.put("/:id/status", "updateStatus");
    Router.get("/search", "search");
  });
});
