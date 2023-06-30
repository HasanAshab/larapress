import Queueable from "illuminate/queue/Queueable";
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
    const sendInQueue = Queueable.isQueueable(notification) && notification.shouldQueue;
    for (const notifiable of notifiables) {
      const channels = notification.via(notifiable);
      for (const channel of channels) {
        const handlerName = "send" + capitalizeFirstLetter(channel) as keyof typeof notification;
        if (typeof notification[handlerName] === "function") {
          if (sendInQueue) {
            const queue = notification.createQueue();
            queue.process(job => (notification[handlerName] as any).bind(notification, notifiable));
            await queue.add({}, {
              delay: this.dispatchAfter,
            });
          } else await (notification[handlerName] as any)(notifiable);
        }
      }
    }
  }
}