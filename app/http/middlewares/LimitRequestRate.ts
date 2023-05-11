import Middleware from "illuminate/middlewares/Middleware";
import { Request, Response, NextFunction } from "express";
import RateLimit from "express-rate-limit";

export default class LimitRequestRate extends Middleware {
  handle = RateLimit({
    windowMs: 60 * 1000,
    max: Number(this.options[0]),
  });
}