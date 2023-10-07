import Middleware from "~/core/abstract/Middleware";
import { Request, Response, NextFunction } from "express";
import passport from 'passport';
import AuthenticationException from "~/app/exceptions/AuthenticationException";

export default class Authenticate extends Middleware {
  async handle(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (user) {
        return next();
      }
      return next(new AuthenticationException());
    })(req, res, next);
  }
}
