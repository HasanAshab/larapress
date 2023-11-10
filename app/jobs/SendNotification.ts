import Job from "~/core/abstract/Job";
import { singleton } from "tsyringe";
import { model } from "mongoose";
import { NotifiableDocument } from "~/app/plugins/Notifiable";
import NotificationService from "~/app/services/NotificationService";


interface SendNotificationData {
  notifiables: Record<string, string[]>;
  notification: {
    path: string; 
    data: object;
  };
}

@singleton()
export default class SendNotification extends Job {
  concurrency = 10;
  tries = 3;
  
  constructor(private readonly notificationService: NotificationService) {
    super();
  }
  
  async handle({ notifiables, notification }: SendNotificationData){
    const NotificationClass = require(notification.path).default;
    const notificationInstance = new NotificationClass(notification.data);
    const notifiableDocuments = await this.fetchNotifiableDocuments(notifiables);
    await this.notificationService.send(notifiableDocuments, notificationInstance);
  }
  
  private async fetchNotifiableDocuments(notifiables: Record<string, string[]>) {
    const fetchPromises: Promise<NotifiableDocument[]>[] = [];
    for(const modelName in notifiables) {
      const promise = model(modelName).find({
        _id: { $in: notifiables[modelName] }
      }).exec();
      fetchPromises.push(promise);
    }
    const notifiableDocuments = await Promise.all(fetchPromises);
    return notifiableDocuments.flat();
  }
}