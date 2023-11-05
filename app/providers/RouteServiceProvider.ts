import ServiceProvider from "~/core/providers/RouteServiceProvider";
import Router, { MiddlewareAliaseWithOrWithoutOptions } from "Router";

export default class RouteServiceProvider extends ServiceProvider {
  
  /**
  * Boot route services
  */
  boot() {
    super.boot();
    Router.model("user", "~/app/models/User");
  }
  
  /**
   * Return global middlewares by its alias with options 
   * that will be executed before every request of the app.
   * Execution order depends on the order of declaration.
  */
  protected globalMiddlewares(): MiddlewareAliaseWithOrWithoutOptions[] {
    return [
      "maintenance.check",
      "limit:1000,5"
    ];
  }
  
  /**
   * Register http routers 
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