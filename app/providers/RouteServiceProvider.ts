import ServiceProvider from "~/core/providers/RouteServiceProvider";
import Router from "Router";

export default class RouteServiceProvider extends ServiceProvider {
  boot() {
    super.boot();
    Router.model("user", "~/app/models/User");
  }
}