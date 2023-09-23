import queue from "~/core/clients/queue";
import NotificationClass from "~/core/abstract/Notification";
import { util } from "~/core/decorators/class";
import { IUser } from "~/app/models/User";
import { capitalizeFirstLetter } from "helpers";

@util("~/core/utils/Notification/Mockable")
export default class Notification {
  static async send(notifiables: IUser | IUser[], notification: NotificationClass) {
    notifiables = Array.isArray(notifiables) ? notifiables: [notifiables];
    for (const notifiable of notifiables) {
      const channels = await notification.via(notifiable);
      const settings = await notifiable.settings;

      for (const channel of channels) {
        if ("type" in notification && !settings.notification[notification.type!][channel]) continue;
        const handlerName = "send" + capitalizeFirstLetter(channel) as keyof typeof notification;
        if (typeof notification[handlerName] === "function") {
          if (notification.shouldQueue) {
            queue.add("SendNotification", {
              notifiable,
              notification: {
                name: notification.constructor.name,
                data: notification.data,
                method: handlerName
              }
            });
          }
          else await (notification[handlerName] as any)(notifiable);
        }
      }
    }
  }
}