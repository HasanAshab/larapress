import Exception from "~/core/exceptions/Exception";
import { Request, Response } from "express";

export default class OtpRequiredException extends Exception {
  render(req: Request, res: Response) {
    res.status(200).api({
      twoFactorAuthRequired: true,
      message: "Credentials matched. otp required!"
    });
  }
}