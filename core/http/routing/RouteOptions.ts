import type RouterConfig from "./RouterConfig";
import type Route from "./Route";
import URL from "URL";
import type { MiddlewareAliaseWithOrWithoutOptions } from "./middleware";

export default class RouteOptions {
  constructor(private config: RouterConfig, private route: Route) {
    this.config = config;
    this.route = route;
  }
  
  /**
   * Add middlewares to a route
  */
  middleware(...aliases: MiddlewareAliaseWithOrWithoutOptions[]) {
    this.route.middlewares.push(...aliases);
    return this;
  }
  
  /**
   * Name a route
  */
  name(routeName: string) {
    routeName = this.resolveRouteName(routeName);
    this.route.metadata.name = routeName;
    URL.add(routeName, this.route.path);
    return this;
  }
  
 /**
  * Join the route name with its parent name
  */
  private resolveRouteName(name: string) {
    return this.config.as + name;
  }
}
