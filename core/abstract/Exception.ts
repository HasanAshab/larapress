import { Request, Response } from "express";

export default abstract class Exception {
  abstract render(req: Request, res: Response): void;
}