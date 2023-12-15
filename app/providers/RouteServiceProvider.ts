import ServiceProvider from "~/core/http/routing/RouteServiceProvider";

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
  
  async boot() {
    if(!this.app.runningInWeb()) return;
    await super.boot();
  }
  
  protected async registerRoutes() {
    await this.router.group({ prefix: "api/v1", as: "v1_" }, async () => {
      await this.router.discover("routes/api/v1");
    });
  }
}