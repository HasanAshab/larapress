import Middleware from "~/core/abstract/Middleware";
import { Request, Response, NextFunction } from "express";
import sanitizeHtml from 'sanitize-html';

export default class SanitizeRequest extends Middleware {
  async handle(req: Request, res: Response, next: NextFunction) {
    for(const field of this.options) {
      req.body[field] = sanitizeHtml(req.body[field], {
        allowedTags: [],
        allowedAttributes: {}
      });
    }
    next();
  }
}