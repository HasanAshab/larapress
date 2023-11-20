import ServiceProvider from "~/core/providers/RouteServiceProvider";
import Router from "Router";
import User from "~/app/models/User";
import Category from "~/app/models/Category";
import Contact from "~/app/models/Contact";
import Media from "~/app/models/Media";

export default class RouteServiceProvider extends ServiceProvider {
  /**
  * Boot route services
  */
  boot() {
    super.boot();
    Router.model("user", User);

    //Router.bind("rawUser", id => User.findByIdOrFail(id).lean().exec());
    Router.bind("rawCategory", id => Category.findByIdOrFail(id).lean().exec());
    Router.bind("rawContact", id => Contact.findByIdOrFail(id).lean().exec());
    Router.bind("rawMedia", id => Media.findByIdOrFail(id).lean().exec());
  }
  
  /**
   * Global middlewares by its alias with options 
   * that will be executed before every request of the app.
   * Execution order depends on the order of declaration.
  */
  protected globalMiddlewares = [
    "maintenance.check",
    "limit:1000,5"
  ];

  /**
   * Register http routers 
  */
  registerRoutes() {
    Router.group({
      prefix: "api/v1",
      as: "v1_"
    }, () => {
      Router.prefix("/").load("~/routes/api/v1");
      Router.prefix("auth").load("~/routes/api/v1/auth");
      Router.prefix("users").load("~/routes/api/v1/users");
      Router.prefix("contact").load("~/routes/api/v1/contact");
      Router.prefix("settings").load("~/routes/api/v1/settings");
      //Router.group({ prefix: "admin", middlewares: ["auth", "roles:admin"] }, "~/routes/api/v1/admin");
      Router.group({ prefix: "admin", middlewares: [] }, "~/routes/api/v1/admin");
      Router.group({ prefix: "notifications", middlewares: ["auth", "verified"] }, "~/routes/api/v1/notifications");
    });
  }
}