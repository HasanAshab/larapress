import Exception from "~/core/abstract/Exception";
import { Request, Response } from "express";

export default class PhoneNumberRequiredException extends Exception {
  render(req: Request, res: Response) {
    res.status(400).api({
      phoneNumberRequired: true,
      message: "Phone number is required!"
    });
  }
}