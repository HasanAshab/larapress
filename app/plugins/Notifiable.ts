import { Schema, Document } from "mongoose";
import NotificationData from "illuminate/notifications/Notification";
import Notification from "illuminate/utils/Notification";

export type INotifiable = {
  instance: {
    notifications: Schema.Types.ObjectId[],
    notify(notification: NotificationData): Promise<void>
  }
}


export default (schema: Schema) => {
  schema.add({
    notifications: [{
      type: Schema.Types.ObjectId,
      ref: "Notification",
    }],
  });
  
  schema.methods.notify = async function(notification: NotificationData) {
    return await Notification.send(this as Document, notification);
  };
}