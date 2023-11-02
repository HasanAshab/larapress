import { IUser } from "~/app/models/User";
import Mail from "Mail";
import NotificationModel from "~/app/models/Notification";
import Mailable from "~/core/abstract/Mailable";
import NotificationData from "~/core/abstract/Notification";
import { Config } from "types";

type NotificationChannel = Config["notification"]["channels"][number];


export default abstract class Notification {
  /**
   * Whether the notification should be queued
  */
  shouldQueue = false;
  
  /**
   * Create notification instance
  */
  constructor(public data: Record<string, unknown> = {}) {
    this.data = data;
  }
  
  /**
   * Channels via the notification should send
  */
  abstract via(notifiable: IUser): Promise<typeof channels[]> | typeof channels[];
  
  /**
   * Mailable that should be send on email channel
  */
  abstract toEmail?(notifiable: IUser): Mailable;
  
  /**
   * Data that should be stored in database on site channel
  */
  abstract toSite?(notifiable: IUser): object;
  
  /**
   * Sends notification via email
  */
  async sendEmail(notifiable: IUser) {
    this.assertProviderExist(this, "toEmail");
    await Mail.to(notifiable.email).send(await this.toEmail!(notifiable));
  }
  
  /**
   * Sends notification via site e.g Notification model
  */
  async sendSite(notifiable: IUser) {
    this.assertProviderExist(this, "toSite");
    await NotificationModel.create({
      userId: notifiable._id,
      data: await this.toSite!(notifiable)
    });
  }
  
  /**
   * Asserts if a given channel provider exists
  */
  assertProviderExist(notification: Notification, methodName: string) {
    if(!this[methodName as keyof this])
      throw new Error(`${methodName}() is required in ${notification.constructor.name} notification!`);
  }
}