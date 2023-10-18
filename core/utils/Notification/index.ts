import _ from "lodash";
import Queue from "bull";
import NotificationClass from "~/core/abstract/Notification";
import { util } from "~/core/decorators/class";
import { IUser } from "~/app/models/User";
import SendNotification from "~/app/jobs/SendNotification";

@util("~/core/utils/Notification/Mockable")
export default class Notification {
  static shouldQueue = true;
  
  static withoutQueue() {
    this.shouldQueue = false;
    return this;
  }
  static prepareJobData(notifiables: IUser | IUser[], notification: NotificationClass) {
    const notifiablesId = Array.isArray(notifiables)
      ? notifiables.map(notifiable => notifiable._id.toString())
      : notifiables._id.toString();
    const notificationMetadata = {
      name: notification.constructor.name,
      data: notification.data
    };
    return { notifiablesId, notificationMetadata };
  }

  static async send(notifiables: IUser | IUser[], notification: NotificationClass) {
    if (this.shouldQueue && notification.shouldQueue) {
      const data = this.prepareJobData(notifiables, notification);
      this.shouldQueue = true;
      return await SendNotification.dispatch(data);
    }
    if(!Array.isArray(notifiables))
      return await this.sendOne(notifiables, notification);
    const sendPromises = notifiables.map(notifiable => this.sendOne(notifiable, notification));
    await Promise.all(sendPromises);
  }
  
  static async sendOne(notifiable: IUser, notification: NotificationClass) {
    const channels = await notification.via(notifiable);
    const sendPromises = channels.map(channel => this.sendOneVia(channel, notifiable, notification));
    await Promise.all(sendPromises);
  }

  static async sendOneVia(channel: NotificationChannel, notifiable: IUser, notification: NotificationClass) {
    const senderName = "send" + _.capitalize(channel);
    await notification[senderName](notifiable);
  }
  
}