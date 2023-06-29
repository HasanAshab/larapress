import NotificationData from "illuminate/notifications/Notification";
import { INotifiable } from "app/plugins/Notifiable";
import { customError, capitalizeFirstLetter } from "helpers";

export default class Notification {
  static send(notifiables: INotifiable | INotifiable[], notification: NotificationData){
    notifiables = Array.isArray(notifiables) ? notifiables : [notifiables];
    for(const notifiable of notifiables){
      const channels = notification.via(notifiable);
      for(const channel of channels){
        const handlerName = "send" + capitalizeFirstLetter(channel) as keyof typeof notification;
        if (typeof notification[handlerName] === "function"){
          (notification[handlerName] as any)(notifiable);
        }
      }
    }
  }
}