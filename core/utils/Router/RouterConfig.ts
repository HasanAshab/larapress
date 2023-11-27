import type { MiddlewareAliaseWithOrWithoutOptions } from "./middleware";

export default interface RouterConfig {
  prefix: string;
  as: string;
  controller: constructor | null;
  middlewares: MiddlewareAliaseWithOrWithoutOptions[];
}
