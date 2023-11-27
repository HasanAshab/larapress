import type RouterConfig from "./RouterConfig";
import type Route from "./Route";
import URL from "URL";
import type { MiddlewareAliaseWithOrWithoutOptions } from "./middleware";

export default class RouteOptions {
  constructor(private route: Route, private config: RouterConfig) {
    this.route = route;
    this.config = config;
  }
  
  /**
   * Add middlewares to a route
  */
  middleware(...aliases: MiddlewareAliaseWithOrWithoutOptions[]) {
    route.middlewares.push(...aliases);
    return this;
  }
  
  /**
   * Name a route
  */
  name(routeName: string) {
    routeName = this.resolveRouteName(routeName);
    URL.add(routeName, route.path);
    route.metadata.name = routeName;
    return this;
  }
  
 /**
  * Join the route name with its parent name
  */
  private resolveRouteName(name: string) {
    return this.config.as + name;
  }
}
