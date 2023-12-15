export interface MiddlewareConfig {
  aliases: object;
}

interface Middleware {
  handle(req: Request, res: Response, next: NextFunction): Promise<void> | void;
}

export default class MiddlewareManager<
  Aliase extends string,
  AliaseWithOptions = `${MiddlewareAliase}:${string}`,
  AliaseWithOrWithoutOptions = MiddlewareAliase | MiddlewareAliaseWithOptions
> {
  constructor(protected middlewares: Record<Aliase, Middleware>) {
    this.middlewares = middlewares;
  }
  
  static async create<Aliase extends string>({ aliases }: MiddlewareConfig) {
    const middlewares: Record<string, Middleware> = {};

    const fetchMiddlewarePromises = Object.entries(aliases).map(async ([alias, path]) => {
      const MiddlewareClass = await importDefault<constructor<Middleware>>(path);
      middlewares[alias] = new MiddlewareClass();
    });

    await Promise.all(fetchMiddlewarePromises);

    return new this(middlewares);
  }
  
  get(aliasesWithOptions: AliaseWithOrWithoutOptions[]) {
    return aliasesWithOptions.map(aliaseWithOptions => {
      const [alias, optionString] = aliaseWithOptions.split(":");
      const options = optionString ? optionString.split(",") : [];
      const middleware = this.middlewares[alias];
      
      return async function(req: Request, res: Response, next: NextFunction) {
        try {
          await middleware.handle(req, res, next, ...options);
        }
        catch(err) {
          next(err)
        }
      }
    });
  }
}