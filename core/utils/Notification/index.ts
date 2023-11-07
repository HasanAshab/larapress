import NotificationClass from "~/core/abstract/Notification";
import { NotifiableDocument } from "~/app/plugins/Notifiable";
import SendNotification from "~/app/jobs/SendNotification";
import NotificationService from "~/app/services/NotificationService";

const notificationService = resolve<NotificationService>(NotificationService);

export default class Notification {
  static prepareJobData<DocType extends NotifiableDocument>(notifiables:  T |  T[], notification: NotificationClass<T>) {
    const notifiablesId = Array.isArray(notifiables)
      ? notifiables.map(notifiable => notifiable._id.toString())
      : notifiables._id.toString();
    const notificationMetadata = {
      path: "~/app/notifications/" + notification.constructor.name,
      data: notification.data
    };
    return { notifiablesId, notificationMetadata };
  }

  static async send<DocType extends NotifiableDocument>(notifiables:  T |  T[], notification: NotificationClass<T>) {
    if (notification.shouldQueue) {
      const data = this.prepareJobData(notifiables, notification);
      return await SendNotification.dispatch(data);
    }
    await notificationService.send(notifiables, notification);
  }
}