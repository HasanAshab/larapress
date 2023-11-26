import Router from "Router";
import DashboardController from "~/app/http/controllers/v1/DashboardController";
import CategoryController from "~/app/http/controllers/v1/CategoryController";

Router.middleware(["auth", "roles:admin"]).group(() => {
  Router.get("/dashboard", [DashboardController, "admin"]);
  Router.apiResource("categories", CategoryController);
});
