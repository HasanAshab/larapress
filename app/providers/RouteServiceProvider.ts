import ServiceProvider from "~/core/providers/RouteServiceProvider";
import Router from "Router";

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
}