import Queue from "~/core/queue/Queue";
import NotificationData from "~/core/notifications/Notification";
import Mockable from "~/core/utils/Notification/Mockable";
import { util } from "~/core/decorators/class";
import { IUser } from "~/app/models/User";
import { capitalizeFirstLetter } from "helpers";

@util(Mockable)
export default class Notification {
  static async send(notifiables: IUser | IUser[], notification: NotificationData) {
    notifiables = Array.isArray(notifiables) ? notifiables: [notifiables];
    for (const notifiable of notifiables) {
      const channels = await notification.via(notifiable);
      const settings = await notifiable.settings;

      for (const channel of channels) {
        if ("type" in notification && !settings.notification[notification.type!][channel]) continue;
        const handlerName = "send" + capitalizeFirstLetter(channel) as keyof typeof notification;
        if (typeof notification[handlerName] === "function") {
          if (notification.shouldQueue) {
            const method = (notification[handlerName] as any).bind(notification);
            const concurrency = notification.concurrency[channel] ?? 20;
            Queue.set("_NOTIFICATION_" + channel, method, concurrency).add(notifiable, { delay: 0 });
          } else await (notification[handlerName] as any)(notifiable);
        }
      }
    }
  }
}