import { Request, Response } from "express";

declare module "express" {
  interface Application {
    request: Request;
    response: Response;
  }
}