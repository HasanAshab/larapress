import ServiceProvider from "~/core/http/routing/RouteServiceProvider";
import Router from "~/core/http/routing/Router";

export default class RouteServiceProvider extends ServiceProvider {
  /**
   * Global middlewares alias with options that
   * will be executed before every request of the app.
   * Execution order depends on the order of declaration.
  */
  protected globalMiddlewares = [
    "maintenance.check",
    "limit:1000,5"
  ];
  
  boot() {
    if(!this.app.runningInWeb()) return;
    super.boot();
  }
  
  protected registerRoutes() {
    Router.group({
      prefix: "api/v1",
      as: "v1_"
    }, () => {
      Router.discover("routes/api/v1");
    });
  }
}