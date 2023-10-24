import _ from "lodash";
import { singleton } from "tsyringe";
import config from 'config';

@singleton()
export default class NotificationService {
  async send(notifiables: IUser | IUser[], notification: NotificationClass) {
    if(!Array.isArray(notifiables))
      return await this.sendOne(notifiables, notification);
    const sendPromises = notifiables.map(notifiable => this.sendOne(notifiable, notification));
    await Promise.all(sendPromises);
  }
  
  async sendOne(notifiable: IUser, notification: NotificationClass) {
    const channels = await notification.via(notifiable);
    const sendPromises = channels.map(channel => this.sendOneVia(channel, notifiable, notification));
    await Promise.all(sendPromises);
  }

  async sendOneVia(channel: NotificationChannel, notifiable: IUser, notification: NotificationClass) {
    const senderName = this.getSenderNameOf(channel);
    await notification[senderName](notifiable);
  }
  
  getSenderNameOf(channel: NotificationChannel) {
    return "send" + _.capitalize(channel);
  }
}
 