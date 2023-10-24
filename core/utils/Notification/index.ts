import NotificationClass from "~/core/abstract/Notification";
import { IUser } from "~/app/models/User";
import SendNotification from "~/app/jobs/SendNotification";
import NotificationService from "~/app/services/NotificationService";

export default class Notification {
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
    console.log(notifiables)
    if (notification.shouldQueue) {
      const data = this.prepareJobData(notifiables, notification);
      return await SendNotification.dispatch(data);
    }
    const notificationService = resolve(NotificationService);
    await notificationService.send(notifiables, notification);
  }
}