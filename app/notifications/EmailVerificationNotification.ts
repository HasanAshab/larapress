import { IUser } from "~/app/models/User";
import Notification from "~/core/abstract/Notification";
import Token from "~/app/models/Token";
import EmailVerificationMail from "~/app/mails/EmailVerificationMail";
import URL from "URL";

export default class EmailVerificationNotification extends Notification {
  shouldQueue = true;

  async via(notifiable: IUser){
    return ["email"];
  }
  
  async toEmail(notifiable: IUser) {
    const token = await this.createVerificationToken(notifiable);
    const link = this.verificationUrl(notifiable, token);
    return new EmailVerificationMail({ link })
  }
  
  verificationUrl(notifiable: IUser, token: string) {
    return URL.route("verify", { id: notifiable._id, token });
  }
  
  async createVerificationToken(notifiable: IUser) {
    const { secret } = await Token.create({
      key: notifiable._id,
      type: "verifyEmail",
      expiresAt: Date.now() + 259200
    });
    return secret;
  }
}