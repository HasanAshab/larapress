import { model, Model, QueryWithHelpers, HydratedDocument, Schema, Document } from "mongoose";
import HasFactory, { HasFactoryModel } from "~/app/plugins/HasFactory";
import HumanReadableTime from "~/app/plugins/HumanReadableTime";
import DocumentNotFoundException from "~/app/exceptions/DocumentNotFoundException";

const NotificationSchema = new Schema<any, any, {}, NotificationQueryHelpers>({
  userId: {
    required: true,
    ref: "User",
    type: Schema.Types.ObjectId,
    cascade: true,
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

NotificationSchema.query.markAsRead = async function(this: QueryWithHelpers<any, NotificationDocument, NotificationQueryHelpers>) {
  const { modifiedCount } = await this.updateOne(this.getFilter(), {readAt: new Date()});
  return modifiedCount === 1;
},
  
NotificationSchema.query.markAsReadOrFail = async function() {
  if(!await this.markAsRead())
    throw new DocumentNotFoundException();
}

NotificationSchema.plugin(HasFactory);
NotificationSchema.plugin(HumanReadableTime);

export interface INotification {
  userId: Schema.Types.ObjectId;
  data: object;
  readAt: object | null;
}

export interface NotificationDocument extends Document, INotification {
  markAsRead(): Promise<void>;
}

export interface NotificationQueryHelpers {
  markAsRead(): Promise<boolean>;
  markAsReadOrFail(): Promise<void>;
}

interface NotificationModel extends Model<NotificationDocument, NotificationQueryHelpers>, HasFactoryModel {}

export default model<NotificationDocument, NotificationModel>("Notification", NotificationSchema);