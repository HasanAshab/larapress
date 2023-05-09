"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Middleware {
    //abstract handle(req: Request, res: Response, next: NextFunction): void;
    constructor(options = []) {
        this.options = options;
        this.options = options;
        //this.handle = passErrorsToHandler(this.handle.bind(this));
    }
}
exports.default = Middleware;
