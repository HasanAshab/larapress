import { IUser } from "~/app/models/User";
import Mail from "Mail";
import Mailable from "~/illuminate/mails/Mailable";
import NotificationModel from "~/app/models/Notification";
import NotificationData from "~/illuminate/notifications/Notification";
import notificationConfig from "~/register/notification";

type NotificationChannel = typeof notificationConfig["channels"][number];
type NotificationTypes = typeof notificationConfig["types"][number];
type MakeKeyNotNull<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

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
    this.assertProviderExist(this, "toEmail");
    await Mail.to(notifiable.email).send(this.toEmail!(notifiable));
  }

  async sendSite(notifiable: IUser) {
    this.assertProviderExist(this, "toSite");
    await NotificationModel.create({
      userId: notifiable._id,
      data: this.toSite!(notifiable)
    });
  }
  
  assertProviderExist(notification: Notification, methodName: string) {
    if(!this[methodName as keyof this])
      throw new Error(`${methodName}() is required in notification ${notification.constructor.name}!`);
  }
}