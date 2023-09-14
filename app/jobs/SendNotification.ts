import Job from "~/core/abstract/Job";

export default class SendNotification extends Job {
  //concurrency = 1;
  
  async handle({ notifiable, notification }){
    const Notification = require("~/app/notifications/" + notification.name).default;
    const notificationInstance = new Notification(notification.data);
    await notificationInstance[notification.method](notifiable);
  }
}