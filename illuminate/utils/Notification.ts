import Queue from "illuminate/queue/Queue";
import NotificationData from "illuminate/notifications/Notification";
import {
  INotifiable
} from "app/plugins/Notifiable";
import {
  capitalizeFirstLetter
} from "helpers";
import {
  Document
} from "mongoose";

export default class Notification {
  static dispatchAfter = 0;
  static async send(notifiables: Document | Document[], notification: NotificationData) {
    notifiables = Array.isArray(notifiables) ? notifiables: [notifiables];
    for (const notifiable of notifiables) {
      const channels = notification.via(notifiable);
      for (const channel of channels) {
        const handlerName = "send" + capitalizeFirstLetter(channel) as keyof typeof notification;
        if (typeof notification[handlerName] === "function") {
          if (Queue.isQueueable(notification)) {
            const processor = job => (notification[handlerName] as any).call(notification, job.data);
            await Queue.get(notification.queueChannel, processor).add(notifiable, { delay });
          } else await (notification[handlerName] as any)(notifiable);
        }
      }
    }
  }
}