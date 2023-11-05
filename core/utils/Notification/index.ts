import NotificationClass from "~/core/abstract/Notification";
import { UserDocument } from "~/app/models/User";
import SendNotification from "~/app/jobs/SendNotification";
import NotificationService from "~/app/services/NotificationService";

const notificationService = resolve<NotificationService>(NotificationService);

export default class Notification {
  static prepareJobData(notifiables: UserDocument | UserDocument[], notification: NotificationClass) {
    const notifiablesId = Array.isArray(notifiables)
      ? notifiables.map(notifiable => notifiable._id.toString())
      : notifiables._id.toString();
    const notificationMetadata = {
      name: notification.constructor.name,
      data: notification.data
    };
    return { notifiablesId, notificationMetadata };
  }

  static async send(notifiables: UserDocument | UserDocument[], notification: NotificationClass) {
    if (notification.shouldQueue) {
      const data = this.prepareJobData(notifiables, notification);
      return await SendNotification.dispatch(data);
    }
    await notificationService.send(notifiables, notification);
  }
}