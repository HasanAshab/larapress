import Job from "~/core/abstract/Job";
import { singleton } from "tsyringe";
import { model } from "mongoose";
import { NotifiableDocument } from "~/app/plugins/Notifiable";
import NotificationService from "~/app/services/NotificationService";

interface NotifiableMetadata {
  id: string;
  modelName: string;
}

interface NotificationMetadata {
  path: string; 
  data: object;
}

interface SendNotificationData {
  notifiables: NotifiableMetadata[];
  notification: NotificationMetadata;
}

@singleton()
export default class SendNotification extends Job {
  concurrency = 10;
  tries = 3;
  
  constructor(private readonly notificationService: NotificationService) {
    super();
  }
  
  async handle({ notifiableModel, notifiablesId, notificationMetadata }: SendNotificationData){
    const NotificationClass = require(notificationMetadata.path).default;
    const notifiables = await model(notifiableModel).find({ _id: { $in: notifiablesId } });
    const notification = new NotificationClass(notificationMetadata.data);
    await this.notificationService.send(notifiables as NotifiableDocument[], notification);
  }
}