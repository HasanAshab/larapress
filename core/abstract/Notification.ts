import { IUser } from "~/app/models/User";
import Mail from "Mail";
import NotificationModel from "~/app/models/Notification";
import Mailable from "~/core/abstract/Mailable";
import NotificationData from "~/core/abstract/Notification";
import config from "config";
import { Config } from "types";

const { channels, types } = config.get<Config["notification"]>("notification");

type NotificationChannel = typeof channels[number];
type NotificationTypes = typeof types[number];

export default abstract class Notification {
  shouldQueue = false;
  type?: NotificationTypes;
  
  constructor(public data: Record<string, unknown>) {
    this.data = data;
  }

  abstract via(notifiable: IUser): Promise<NotificationChannel[]> | NotificationChannel[];
  abstract toEmail?(notifiable: IUser): Mailable;
  abstract toSite?(notifiable: IUser): object;
  
  async sendEmail(notifiable: IUser) {
    this.assertProviderExist(this, "toEmail");
    await Mail.to(notifiable.email).send(await this.toEmail!(notifiable));
  }

  async sendSite(notifiable: IUser) {
    this.assertProviderExist(this, "toSite");
    await NotificationModel.create({
      userId: notifiable._id,
      data: await this.toSite!(notifiable)
    });
  }
  
  assertProviderExist(notification: Notification, methodName: string) {
    if(!this[methodName as keyof this])
      throw new Error(`${methodName}() is required in ${notification.constructor.name} notification!`);
  }
}