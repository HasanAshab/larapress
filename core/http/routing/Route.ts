import type { constructor } from "types";
import type { MiddlewareAliaseWithOrWithoutOptions } from "./middleware";

export default interface Route {
  method: RequestMethod;
  path: string;
  middlewares: MiddlewareAliaseWithOrWithoutOptions[];
  metadata: {
    name?: string;
    key: string;
    controller: constructor | InvokableController | APIResourceController;
  }
}
