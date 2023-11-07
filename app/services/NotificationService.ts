import Notification from "~/core/abstract/Notification";
import { NotifiableDocument } from "~/app/plugins/Notifiable";
import { capitalize } from "lodash";
import { singleton } from "tsyringe";
import notificationConfig from "~/config/notification";

type NotificationChannel = typeof notificationConfig["channels"][number];

@singleton()
export default class NotificationService {
  async send(notifiables:  NotifiableDocument |  NotifiableDocument[], notification: Notification) {
    if(!Array.isArray(notifiables))
      return await this.sendOne(notifiables, notification);
    const sendPromises = notifiables.map(notifiable => this.sendOne(notifiable, notification));
    await Promise.all(sendPromises);
  }
  
  async sendOne(notifiable:  NotifiableDocument, notification: Notification) {
    const channels = await notification.via(notifiable);
    const sendPromises = channels.map(channel => this.sendOneVia(channel, notifiable, notification));
    await Promise.all(sendPromises);
  }

  async sendOneVia(channel: NotificationChannel, notifiable:  NotifiableDocument, notification: Notification) {
    const senderName = this.getSenderNameOf(channel) as keyof Notification;
    await (notification[senderName] as any)(notifiable);
  }
  
  getSenderNameOf(channel: NotificationChannel) {
    return "send" + capitalize(channel);
  }
}
 