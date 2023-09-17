import { model, QueryWithHelpers, HydratedDocument, Schema, Model, Document, InferSchemaType } from "mongoose";
import HasFactory, { HasFactoryModel } from "~/app/plugins/HasFactory";
import HumanReadableTime from "~/app/plugins/HumanReadableTime";
import { IUser } from "~/app/models/User";

const NotificationSchema = new Schema({
  userId: {
    required: true,
    type: Schema.Types.ObjectId
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
  }
};

NotificationSchema.query = notificationQuery;

NotificationSchema.plugin(HasFactory);
NotificationSchema.plugin(HumanReadableTime);

export interface INotification extends Document, InferSchemaType<typeof NotificationSchema> {
  markAsRead(): Promise<void>;
}

export type NotificationQuery = QueryWithHelpers<HydratedDocument<INotification>[], HydratedDocument<INotification>, NotificationQueryHelpers>;

interface NotificationQueryHelpers {
  markAsRead(): boolean
}

interface NotificationModel extends Model<INotification, NotificationQueryHelpers>, HasFactoryModel {}
export default model<INotification, NotificationModel>("Notification", NotificationSchema);