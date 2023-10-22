import Router from "Router";
import UserController from "~/app/http/v1/controllers/UserController";

// Endpoints for user management

Router.controller(UserController).group(() => {
  Router.middleware(["auth", "verified"]).group(() => {
    Router.get("/me", "profile");
    Router.put("/me", "updateProfile");
    Router.get("/:username", "show");
    Router.delete("/:username", "delete");
  });

  //Router.middleware(["auth", "roles:admin"]).group(() => {
    Router.get("/", "index");
    Router.put("/:username/make-admin", "makeAdmin");
  //});
});