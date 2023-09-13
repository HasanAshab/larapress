import { Schema, Document } from "mongoose";
import NotificationClass from "~/core/abstract/Notification";
import Notification from "Notification";
import NotificationModel, { INotification, NotificationQuery } from "~/app/models/Notification";

export interface NotifiableDocument extends Document {
  notifications: NotificationQuery;
  unreadNotifications: NotificationQuery;
  notify(notification: NotificationClass): Promise<void>;
}

export default (schema: Schema) => {

  schema.virtual('notifications').get(function () {
    return NotificationModel.find({ userId: this._id });
  });

  schema.virtual('unreadNotifications').get(function () {
    return this.notifications.where("readAt").equals(null);
  });

  schema.methods.notify = function(notification: NotificationClass) {
    return Notification.send(this as any, notification);
  };
}