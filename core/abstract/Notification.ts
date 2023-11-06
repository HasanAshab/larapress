import { UserDocument } from "~/app/models/User";
import Mail from "Mail";
import NotificationModel from "~/app/models/Notification";
import Mailable from "~/core/abstract/Mailable";
import NotificationData from "~/core/abstract/Notification";
import notificationConfig from "~/config/notification";

type NotificationChannel = typeof notificationConfig["channels"][number];


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
  abstract via(notifiable: UserDocument): Promise<NotificationChannel[]> | NotificationChannel[];
  
  /**
   * Mailable that should be send on email channel
  */
  protected toEmail(notifiable: UserDocument): Promise<Mailable> | Mailable  {
    return {} as any;
  }
  
  /**
   * Return notification data that should be 
   * stored in database on site channel
  */
  protected toSite(notifiable: UserDocument): Promise<object> | object {
    return {};
  };
  
  /**
   * Sends notification via email
  */
  async sendEmail(notifiable: UserDocument) {
    this.assertProviderExist(this, "toEmail");
    await Mail.to(notifiable.email).send(await this.toEmail!(notifiable));
  }
  
  /**
   * Sends notification via site e.g Notification model
  */
  async sendSite(notifiable: UserDocument) {
    this.assertProviderExist(this, "toSite");
    await NotificationModel.create({
      userId: notifiable._id,
      data: await this.toSite!(notifiable)
    });
  }
  
  /**
   * Asserts if a given channel provider exists
  */
  private assertProviderExist(notification: Notification, methodName: string) {
    if(!this[methodName as keyof this])
      throw new Error(`${methodName}() is required in ${notification.constructor.name} notification!`);
  }
}