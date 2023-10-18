import Job from "~/core/abstract/Job";
import { singleton } from "tsyringe";
import User, { IUser } from "~/app/models/User";
import NotificationService from "~/app/services/NotificationService";

/*
interface SendNotificationData {
  notifiable: IUser;
  notification: {
    name: string; 
    data: object;
    method: string;
  }
}
*/
@singleton()
export default class SendNotification extends Job {
  concurrency = 10;
  tries = 3;
  
  constructor(private readonly notificationService: NotificationService) {
    super();
  }
  
  async handle({ notifiablesId, notificationMetadata }: SendNotificationData){
    const NotificationClass = require("~/app/notifications/" + notificationMetadata.name).default;
    const notifiables = await User.find({ _id: { $in: notifiablesId } });
    const notification = new NotificationClass(notificationMetadata.data);
    await this.notificationService.send(notifiables, notification);
  }
}