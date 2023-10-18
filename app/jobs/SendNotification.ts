import Job from "~/core/abstract/Job";
import User, { IUser } from "~/app/models/User";
import Notification from "Notification";

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
export default class SendNotification extends Job {
  concurrency = 10;
  tries = 3;
  
  async handle({ notifiablesId, notificationMetadata }: SendNotificationData){
    const NotificationClass = require("~/app/notifications/" + notificationMetadata.name).default;
    const notifiables = await User.find({ _id: { $in: notifiablesId } });
    await Notification.withoutQueue().send(notifiables, new NotificationClass(notificationMetadata.data));
  }
}