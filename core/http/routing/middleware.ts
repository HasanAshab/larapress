import type MiddlewareConfig from "~/config/middleware";

export type MiddlewareAliase = keyof MiddlewareConfig["aliases"];
export type MiddlewareAliaseWithOptions = `${MiddlewareAliase}:${string}`;
export type MiddlewareAliaseWithOrWithoutOptions = MiddlewareAliase | MiddlewareAliaseWithOptions;
