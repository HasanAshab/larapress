import NotificationClass from "~/core/abstract/Notification";
import type { NotifiableDocument } from "~/app/plugins/Notifiable";
import SendNotification from "~/app/jobs/SendNotification";
import NotificationService from "~/app/services/NotificationService";

export default class Notification {
  static async send<DocType extends NotifiableDocument>(notifiables:  DocType | DocType[], notification: NotificationClass<DocType>) {
    if (notification.shouldQueue) {
      const data = this.prepareJobData(notifiables, notification);
      return await SendNotification.dispatch(data);
    }
    const notificationService = resolve<NotificationService>(NotificationService);
    await notificationService.send(notifiables, notification);
  }
  
  static prepareJobData<DocType extends NotifiableDocument>(notifiables:  DocType | DocType[], notification: NotificationClass<DocType>) {
    notifiables = Array.isArray(notifiables) ? notifiables : [notifiables];
    const notificationMetadata = {
      path: "~/app/notifications/" + notification.constructor.name,
      data: notification.data
    };
    
    return { 
      notifiables: this.groupNotifiablesIdByModel(notifiables),
      notification: notificationMetadata
    };
  }
  
  static groupNotifiablesIdByModel(notifiables: NotifiableDocument[]) {
    return notifiables.reduce((group: Record<string, string[]>, notifiable) => {
      const model = notifiable.constructor.modelName;
      const id = notifiable._id.toString();
      if(group[model]) {
        group[model].push(id);
      }
      else {
        group[model] = [id];
      }
      
      return group;
    }, {});
  }
}