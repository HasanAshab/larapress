import { Request, Response, NextFunction } from "express";
import Config from "Config";
import axios from "axios";

export default class VerifyRecaptcha {
  async handle(req: Request, res: Response, next: NextFunction) {
    const body = {
      secret: Config.get("recaptcha.secretKey"),
      response: req.body.recaptchaResponse
    }
    
    const { data } = await axios.post('https://www.google.com/recaptcha/api/siteverify', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    if (data.success) {
      return next();
    }
    res.status(400).message('reCAPTCHA verification failed!')
  }
}