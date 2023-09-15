import Job from "~/core/abstract/Job";
import { IUser } from "~/app/models/User";

interface SendNotificationData {
  notifiable: IUser;
  notification: {
    name: string; 
    data: object;
    method: string;
  }
}

export default class SendNotification extends Job {
  concurrency = 10;
  tries = 3;
  
  async handle({ notifiable, notification }: SendNotificationData){
    const Notification = require("~/app/notifications/" + notification.name).default;
    const notificationInstance = new Notification(notification.data);
    await notificationInstance[notification.method](notifiable);
  }
}