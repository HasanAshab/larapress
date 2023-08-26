import Middleware from "~/illuminate/middlewares/Middleware";
import { Request, Response, NextFunction } from "express";
import config from "config";
import fetch from "node-fetch";

export default class VerifyRecaptcha extends Middleware {
  async handle(req: Request, res: Response, next: NextFunction) {
    const recaptchaResponse = req.body.recaptchaResponse;
    const verificationResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${config.get<any>("recaptcha.secretKey")}&response=${recaptchaResponse}`,
    });
    const verificationResult: any = await verificationResponse.json();
    if (!verificationResult.success) {
      return res.status(400).api({
        message: 'reCAPTCHA verification failed!'
      });
    }
    next();
  }
}