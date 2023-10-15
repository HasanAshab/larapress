import { IUser } from "~/app/models/User";
import Notification from "~/core/abstract/Notification";
import ForgotPasswordMail from "~/app/mails/ForgotPasswordMail";
import Token from "~/app/models/Token";
import URL from "URL";

export default class ForgotPasswordNotification extends Notification {
  shouldQueue = true;

  via(notifiable: IUser){
    return ["email"];
  }
  
  async toEmail(notifiable: IUser) {
    const token = await this.createForgotPasswordToken(notifiable);
    const url = this.forgotPasswordUrl(notifiable, token);
    return new ForgotPasswordMail({ url });
  }
  
  async createForgotPasswordToken(notifiable: IUser) {
    const { secret } = await Token.create({
      key: notifiable._id,
      type: "resetPassword",
      expiresAt: Date.now() + 259200
    });
    return secret;
  }
  
  forgotPasswordUrl(notifiable: IUser, token: string) {
    return URL.client(`/password/reset/${notifiable._id}/${token}`);
  }
}