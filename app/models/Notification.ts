import { model, QueryWithHelpers, HydratedDocument, Schema, Model, Document, InferSchemaType } from "mongoose";
import HasFactory, { HasFactoryModel } from "app/plugins/HasFactory";
import Polymorphable from "app/plugins/Polymorphable";
import HumanReadableTime from "app/plugins/HumanReadableTime";
import { IUser } from "app/models/User";

const NotificationSchema = new Schema({
  data: {
    required: true,
    type: Object
  },
  readAt: {
    type: Date,
    default: null
  },
},
{ 
  timestamps: true,
  query: {
    async markAsRead(){
      const { modifiedCount } = await this.updateOne(this.getFilter(), {readAt: new Date()});
      return modifiedCount === 1;
    }
  },
  methods: {
    async markAsRead(){
      this.readAt = new Date();
      await this.save();
    }
  }
}
);


NotificationSchema.plugin(HasFactory);
NotificationSchema.plugin(Polymorphable, "notifiable");
NotificationSchema.plugin(HumanReadableTime);

export interface INotification extends Document, InferSchemaType<typeof NotificationSchema> {
  notifiable: IUser;
  markAsRead(): Promise<void>;
}

export type NotificationQuery = QueryWithHelpers<HydratedDocument<INotification>[], HydratedDocument<INotification>, NotificationQueryHelpers>;

interface NotificationQueryHelpers {
  markAsRead(): NotificationQuery
}

interface NotificationModel extends Model<INotification, NotificationQueryHelpers>, HasFactoryModel {}
export default model<INotification, NotificationModel>("Notification", NotificationSchema);