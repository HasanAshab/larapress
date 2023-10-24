import { model, QueryWithHelpers, HydratedDocument, Schema, Model, Document } from "mongoose";
import HasFactory, { HasFactoryModel } from "~/app/plugins/HasFactory";
import HumanReadableTime from "~/app/plugins/HumanReadableTime";
import { IUser } from "~/app/models/User";
import DocumentNotFoundException from "~/app/exceptions/DocumentNotFoundException";

const NotificationSchema = new Schema({
  userId: {
    required: true,
    type: Schema.Types.ObjectId,
    index: true
  },
  data: {
    required: true,
    type: Object
  },
  readAt: {
    type: Date,
    default: null
  },
},
{ timestamps: true }
);

NotificationSchema.methods.markAsRead = async function(){
  this.readAt = new Date();
  await this.save();
}

const notificationQuery = {
  async markAsRead(){
    const { modifiedCount } = await this.updateOne(this.getFilter(), {readAt: new Date()});
    return modifiedCount === 1;
  },
  async markAsReadOrFail(){
    if(!await this.markAsRead())
      throw new DocumentNotFoundException();
  }
};

NotificationSchema.query = notificationQuery;

NotificationSchema.plugin(HasFactory);
NotificationSchema.plugin(HumanReadableTime);

export interface INotification {
  userId: string;
  data: object;
  readAt: object | null;
}

export interface NotificationDocument extends Document, INotification {
  markAsRead(): Promise<void>;
}

export type NotificationQuery = QueryWithHelpers<NotificationDocument[], NotificationDocument, typeof notificationQuery>;
interface NotificationModel extends Model<INotification, typeof notificationQuery>, HasFactoryModel {}

export default model<NotificationDocument, NotificationModel>("Notification", NotificationSchema);