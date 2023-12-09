import Notification from "~/core/abstract/Notification";
import { NotifiableDocument } from "~/app/plugins/Notifiable";
import { capitalize } from "lodash-es";
import { singleton } from "tsyringe";
import notificationConfig from "~/config/notification";

type NotificationChannel = typeof notificationConfig["channels"][number];

@singleton()
export default class NotificationService {
  async send<DocType extends NotifiableDocument>(notifiables: DocType | DocType[], notification: Notification<DocType>) {
    if(!Array.isArray(notifiables))
      return await this.sendOne(notifiables, notification);
    const sendPromises = notifiables.map(notifiable => this.sendOne(notifiable, notification));
    await Promise.all(sendPromises);
  }
  
  async sendOne<DocType extends NotifiableDocument>(notifiable: DocType, notification: Notification<DocType>) {
    const channels = await notification.via(notifiable);
    const sendPromises = channels.map(channel => this.sendOneVia(channel, notifiable, notification));
    await Promise.all(sendPromises);
  }

  async sendOneVia<DocType extends NotifiableDocument>(channel: NotificationChannel, notifiable: DocType, notification: Notification<DocType>) {
    const senderName = this.getSenderNameOf(channel) as keyof Notification<DocType>;
    await (notification[senderName] as any)(notifiable);
  }
  
  getSenderNameOf(channel: NotificationChannel) {
    return "send" + capitalize(channel);
  }
}
 