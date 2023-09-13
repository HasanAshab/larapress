import { Schema, Document } from "mongoose";
import NotificationClass from "~/core/abstract/Notification";
import Notification from "Notification";
import NotificationModel, { INotification, NotificationQuery } from "~/app/models/Notification";
import { log } from "helpers";

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

  schema.pre(["deleteOne", "deleteMany"], function(next) {
    const query = this.getQuery();
    if(query._id) {
      NotificationModel.deleteMany({ userId: query._id }).catch(log);
      return next();
    }
    this.model.find(query).select("_id").then(deletedDocs => {
      next();
      const deletedDocsId = deletedDocs.map(doc => doc._id);
      console.log(deletedDocsId)
      NotificationModel.deleteMany({ userId: { $in: deletedDocsId }}).then(console.log).catch(log);
    }).catch(log);
  });

  schema.methods.notify = function(notification: NotificationClass) {
    return Notification.send(this as any, notification);
  };
}