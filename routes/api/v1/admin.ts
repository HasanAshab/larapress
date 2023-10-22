import Router from "Router";
import DashboardController from "~/app/http/v1/controllers/DashboardController";
import CategoryController from "~/app/http/v1/controllers/CategoryController";


Router.middleware(["auth", "roles:admin"]).group(() => {
  Router.post("/dashboard", [DashboardController, "admin"]);
  Router.apiResource("/categories", CategoryController);
});
