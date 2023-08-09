import { Schema, Document } from "mongoose";
import NotificationClass from "illuminate/notifications/Notification";
import Notification from "illuminate/utils/Notification";
import NotificationModel, { INotification, NotificationQuery } from "app/models/Notification";

export interface NotifiableDocument extends Document {
  notifications: NotificationQuery;
  unreadNotifications: NotificationQuery;
  markNotificationsAsRead(): NotificationQuery;
  notify(notification: NotificationClass): Promise<void>;
}

export default (schema: Schema) => {
  schema.virtual('notifications').get(function () {
    return NotificationModel.find({
      notifiableId: this._id,
      notifiableType: (this.constructor as any).modelName,
    });
  });

  schema.virtual('unreadNotifications').get(function () {
    return this.notifications.where("readAt").equals(null);
  });
  
  schema.pre<NotifiableDocument>(["deleteOne", "deleteMany"], function(next) {
    this.notifications.deleteMany();
    next();
  });

  schema.methods.notify = function(notification: NotificationClass) {
    return Notification.send(this as any, notification);
  };
  
  schema.methods.markNotificationsAsRead = function () {
    return this.unreadNotifications.updateMany({
      readAt: new Date()
    });
  }
}