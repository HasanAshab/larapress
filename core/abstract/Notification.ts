import type { NotifiableDocument } from "~/app/plugins/Notifiable";
import Mail from "Mail";
import NotificationModel from "~/app/models/Notification";
import Mailable from "~/core/abstract/Mailable";
import NotificationData from "~/core/abstract/Notification";
import notificationConfig from "~/config/notification";

type NotificationChannel = typeof notificationConfig["channels"][number];


export default abstract class Notification<DocType extends NotifiableDocument> {
  /**
   * type of the notification
   */
   type?: string;
 
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
  abstract via(notifiable: DocType): Promise<NotificationChannel[]> | NotificationChannel[];
  
  /**
   * Mailable that should be send on email channel
  */
  protected toEmail(notifiable: DocType): Promise<Mailable> | Mailable  {
    throw new Error(`toEmail() not implemented in ${this.constructor.name} notification!`);
    return {} as any;
  }
  
  /**
   * Return notification data that should be 
   * stored in database on site channel
  */
  protected toSite(notifiable: DocType): Promise<object> | object {
    throw new Error(`toSite() not implemented in ${this.constructor.name} notification!`);
    return {};
  };
  
  /**
   * Sends notification via email
  */
  async sendEmail(notifiable: DocType) {
    if("email" in notifiable && typeof notifiable.email === "string")
      return await Mail.to(notifiable.email).send(await this.toEmail(notifiable));
    throw new Error("Can not send notification via email as notifiable has no email, notifiable: " + JSON.stringify(notifiable, null, 2));
  }
  
  /**
   * Sends notification via site e.g Notification model
  */
  async sendSite(notifiable: DocType) {
    await NotificationModel.create({
      userId: notifiable._id,
      type: this.type ?? this.constructor.name,
      data: await this.toSite(notifiable)
    });
  }
}