import Middleware from "illuminate/middlewares/Middleware";
import { Request, Response, NextFunction } from "express";

export default class VerifyRecaptcha extends Middleware {
  async handle(req: Request, res: Response, next: NextFunction) {
    const recaptchaResponse = req.body.recaptchaResponse;
    const verificationResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`,
    });
    const verificationResult = await verificationResponse.json();
    if (!verificationResult.success) {
      return res.status(400).json({
        message: 'reCAPTCHA verification failed!'
      });
    }
    next();
  }
}