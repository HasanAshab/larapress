import { Schema } from "mongoose";
//import Mailable from "illuminate/mails/Mailable";
//import Mail from "illuminate/utils/Mail";
import NotificationData from "illuminate/notifications/Notification";
import Notification from "illuminate/utils/Notification";

export type INotifiable = {
  instance: {
    notify(notification: NotificationData): Promise<void>
  }
}


export default (schema: Schema) => {
  schema.methods.notify = async function(notification: NotificationData) {
    return await Notification.send(this, notification);
  };
}