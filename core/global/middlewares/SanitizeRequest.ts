import Middleware from "~/core/abstract/Middleware";
import { Request, Response, NextFunction } from "express";
import sanitizeHtml from 'sanitize-html';

export default class SanitizeRequest extends Middleware {
  async handle(req: Request, res: Response, next: NextFunction, ...fields: string[]) {
    for(const field of fields) {
      req.body[field] = sanitizeHtml(req.body[field], {
        allowedTags: [],
        allowedAttributes: {}
      });
    }
    next();
  }
}