import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
import HasFactory, { IHasFactory } from "app/plugins/HasFactory";

const NotificationSchema = new Schema({
  notifiableType: {
    required: true,
    type: String
  },
  notifiableId: {
    required: true,
    type: Schema.Types.ObjectId
  },
  data: {
    required: true,
    type: Object
  },
  readAt: {
    nullable: true,
    type: Date
  },
},
{ timestamps: true }
);

NotificationSchema.plugin(HasFactory);


type IPlugin = {statics: {}, instance: {}} & IHasFactory;
export type INotification = Document & InferSchemaType<typeof NotificationSchema> & IPlugin["instance"];
type NotificationModel = Model<INotification> & IPlugin["statics"];
export default model<INotification, NotificationModel>("Notification", NotificationSchema);