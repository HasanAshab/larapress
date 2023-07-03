import {
  Schema,
  Document
} from "mongoose";
import NotificationData from "illuminate/notifications/Notification";
import Notification from "illuminate/utils/Notification";
import NotificationModel from "app/models/Notification";

export type INotifiable = {
  instance: {
    notify(notification: NotificationData): Promise < void >
  }
}

export default (schema: Schema) => {
  schema.virtual('notifications').get(function () {
      return NotificationModel.find({
        notifiableId: this._id,
        notifiableType: this.constructor.modelName,
      });
  });

  schema.virtual('unreadNotifications').get(function () {
    return this.notifications.where("readAt").equals(null).exec();
  });
  

  schema.methods.notify = async function(notification: NotificationData) {
    return await Notification.send(this as Document, notification);
  };

  //  schema.methods.notify = async function(notification: NotificationData) {}
}