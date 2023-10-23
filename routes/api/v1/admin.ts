import Router from "Router";
import DashboardController from "~/app/http/controllers/v1/DashboardController";
import CategoryController from "~/app/http/controllers/v1/CategoryController";


Router.middleware(["auth", "roles:admin"]).group(() => {
  Router.post("/dashboard", [DashboardController, "admin"]);
  Router.apiResource("/categories", CategoryController);
});
