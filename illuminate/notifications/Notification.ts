import { IUser } from "app/models/User";
import Mail from "illuminate/utils/Mail";
import Mailable from "illuminate/mails/Mailable";
import NotificationModel from "app/models/Notification";

export default abstract class Notification {
  shouldQueue = false;

  constructor(public data: Record<string, unknown>) {
    this.data = data;
  }
  
  abstract via(notifiable: IUser): Promise<string[]> | string[];
  abstract toEmail?(notifiable: IUser): Mailable;
  abstract toDatabase?(notifiable: IUser): object;
  
  async sendEmail(notifiable: IUser) {
    this.toEmail && await Mail.to(notifiable.email).send(this.toEmail(notifiable));
  }

  async sendSite(notifiable: IUser) {
    if(this.toSite){
      const notification = await NotificationModel.create({
        notifiableType: notifiable.modelName,
        notifiableId: notifiable._id,
        data: this.toSite(notifiable)
      });
    }
  }
}