import type { constructor } from "types";
import type { MiddlewareAliaseWithOrWithoutOptions } from "./middleware";

export default interface Route {
  method: RequestMethod;
  path: string;
  metadata: {
    name?: string;
    key: string;
    controller: constructor | InvokableController | APIResourceController;
  }
  middlewares: MiddlewareAliaseWithOrWithoutOptions[];
}
