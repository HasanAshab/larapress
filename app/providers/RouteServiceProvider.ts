import ServiceProvider from "~/core/providers/RouteServiceProvider";
import Router, { MiddlewareAliaseWithOptions } from "Router";

export default class RouteServiceProvider extends ServiceProvider {
  /**
   * Register global middlewares by its alias with options 
   * that will be executed before every request of the app.
   * Execution order depends on the order of declaration.
  */
  protected globalMiddlewares: MiddlewareAliaseWithOptions[]  = [
    "maintenance.check",
    "limit:1000,5"
  ];
  
  /**
  * Boot route services
  */
  boot() {
    super.boot();
    Router.model("user", "~/app/models/User");
  }
  
  /**
   * Register all routers 
  */
  registerRoutes() {
    Router.group({
      prefix: "api/v1",
      as: "v1_"
    }, () => {
      Router.prefix("auth").load("~/routes/api/v1/auth");
      Router.prefix("users").load("~/routes/api/v1/users");
      Router.prefix("contact").load("~/routes/api/v1/contact");
      Router.prefix("settings").load("~/routes/api/v1/settings");
      Router.group({ prefix: "admin", middlewares: ["auth", "roles:admin"] }, "~/routes/api/v1/admin");
      Router.group({ prefix: "notifications", middlewares: ["auth", "verified"] }, "~/routes/api/v1/notifications");
    });
  }
}