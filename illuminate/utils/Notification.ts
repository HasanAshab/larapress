import Queue from "illuminate/queue/Queue";
import NotificationData from "illuminate/notifications/Notification";
import { INotifiable } from "app/plugins/Notifiable";
import { capitalizeFirstLetter } from "helpers";
import { Document } from "mongoose";
import expect from "expect";

export default class Notification {
  static isMocked = false;
  static mock() {
    Notification.isMocked = true;
  }
  static mocked = {
    data: {} as Record<string, string[]>,
    reset() {
      this.data = {}
    }
  }
  
  static assertSentTo(notifiables: Document | Document[], notification: string){
    const notifiablesId = Array.isArray(notifiables) ? notifiables.map((notifiable) => notifiable._id).sort() : [notifiables._id];
    const sentNotifiablesId = this.mocked.data[notification].sort();
    console.log(sentNotifiablesId, notifiablesId)
    expect(sentNotifiablesId).toHaveLength(notifiablesId.length);
    for(let i = 0; i < notifiablesId.length; i++)
      expect(sentNotifiablesId[i].toString()).toBe(notifiablesId[i].toString());
  }
  static assertNothingSent(){
    expect(Object.keys(this.mocked.data)).toHaveLength(0)
  }

  static async send(notifiables: Document | Document[], notification: NotificationData) {
    notifiables = Array.isArray(notifiables) ? notifiables: [notifiables];
    if(Notification.isMocked){
      const notifiablesId = notifiables.map((notifiable) => notifiable._id);
      if(Notification.mocked.data[notification.constructor.name]){
        Notification.mocked.data[notification.constructor.name].concat(notifiablesId)
      }
      else {
        Notification.mocked.data[notification.constructor.name] = notifiablesId;
      }
      return;
    }
    for (const notifiable of notifiables) {
      (notifiable as any).modelName = (notifiable.constructor as any).modelName;
      const channels = notification.via(notifiable);
      for (const channel of channels) {
        const handlerName = "send" + capitalizeFirstLetter(channel) as keyof typeof notification;
        if (typeof notification[handlerName] === "function") {
          if (notification.shouldQueue) {
            const method = (notification[handlerName] as any).bind(notification);
            const concurrency = notification.concurrency[channel as keyof typeof notification.concurrency];
            Queue.set("_NOTIFICATION_" + channel, method, concurrency).add(notifiable, { delay: 0 });
          } else await (notification[handlerName] as any)(notifiable);
        }
      }
    }
  }
}