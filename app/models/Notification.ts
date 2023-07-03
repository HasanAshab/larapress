import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
import HasFactory, { IHasFactory } from "app/plugins/HasFactory";

const NotificationSchema = new Schema({
  notifiable: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'notifiableType'
  },
  
  notifiableType: {
    required: true,
    type: String
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


NotificationSchema.methods.markAsRead = async function (){
  this.readAt = new Date();
  await this.save();
}

NotificationSchema.plugin(HasFactory);

type IPlugin = {statics: {}, instance: {}} & IHasFactory;
export type INotification = Document & InferSchemaType<typeof NotificationSchema> & IPlugin["instance"];
type NotificationModel = Model<INotification> & IPlugin["statics"];
export default model<INotification, NotificationModel>("Notification", NotificationSchema);