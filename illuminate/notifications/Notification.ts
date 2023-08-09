import { IUser } from "app/models/User";
import Mail from "illuminate/utils/Mail";
import Mailable from "illuminate/mails/Mailable";
import NotificationModel from "app/models/Notification";
import notificationConfig from "register/notification";

type NotificationChannel = typeof notificationConfig["channels"][number];
type NotificationTypes = typeof notificationConfig["types"][number];

export default abstract class Notification {
  shouldQueue = false;
  concurrency: Record<NotificationChannel, number>  = {};
  type?: NotificationTypes;
  
  constructor(public data: Record<string, unknown>) {
    this.data = data;
  }
  
  abstract via(notifiable: IUser): Promise<NotificationChannel[]> | NotificationChannel[];
  abstract toEmail?(notifiable: IUser): Mailable;
  abstract toSite?(notifiable: IUser): object;
  
  async sendEmail(notifiable: IUser) {
    this.toEmail && await Mail.to(notifiable.email).send(this.toEmail(notifiable));
  }

  async sendSite(notifiable: IUser) {
    if(this.toSite){
      const notification = await NotificationModel.create({
        notifiableType: (notifiable as any).modelName,
        notifiableId: notifiable._id,
        data: this.toSite(notifiable)
      });
    }
  }
}