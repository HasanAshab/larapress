import Router from "~/core/http/routing/Router";
import DashboardController from "~/app/http/controllers/v1/DashboardController";
import CategoryController from "~/app/http/controllers/v1/CategoryController";
import b from "~/main/b";

//await Router.middleware(["auth", "roles:admin"]).group(() => {
await Router.middleware([]).group(() => {
 b
  Router.get("/dashboard", [DashboardController, "admin"]);
  Router.apiResource("categories", CategoryController);
});
