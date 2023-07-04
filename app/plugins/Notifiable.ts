import {
  Schema,
  Document
} from "mongoose";
import NotificationData from "illuminate/notifications/Notification";
import Notification from "illuminate/utils/Notification";
import NotificationModel, { INotification } from "app/models/Notification";

export type INotifiable = {
  instance: {
    notifications: INotification[],
    unreadNotifications: INotification[],
    notify(notification: NotificationData): Promise < void >
  }
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
  
  schema.methods.notify = async function(notification: NotificationData) {
    return await Notification.send(this as Document, notification);
  };
  
  schema.methods.markNotificationsAsRead = function () {
    return this.unreadNotifications.updateMany({
      readAt: new Date()
    })
  }
}