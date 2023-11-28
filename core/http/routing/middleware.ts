export type MiddlewareAliase = keyof typeof middlewareConfig["aliases"];
export type MiddlewareAliaseWithOptions = `${MiddlewareAliase}:${string}`;
export type MiddlewareAliaseWithOrWithoutOptions = MiddlewareAliase | MiddlewareAliaseWithOptions;
