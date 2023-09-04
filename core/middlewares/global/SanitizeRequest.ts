import Middleware from "~/core/middlewares/Middleware";
import { Request, Response, NextFunction } from "express";
import sanitizeHtml from 'sanitize-html';

export default class SanitizeRequest extends Middleware {
  async handle(req: Request, res: Response, next: NextFunction) {
    for(const field of this.config.fields as string[]) {
      req.body[field] = sanitizeHtml(field, {
        allowedTags: [],
        allowedAttributes: {}
      });
    }
    next();
  }
}