import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
import HasFactory, { IHasFactory } from "app/plugins/HasFactory";

const NotificationSchema = new Schema({
  notifiableId: {
    required: true,
    type: Schema.Types.ObjectId
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



NotificationSchema.virtual('notifiable').get(function () {
  return model(this.notifiableType).findById(this.notifiableId);
});

NotificationSchema.method.markAsRead = async function (){
  this.readAt = new Date();
  await this.save();
}

NotificationSchema.query.markAsRead = async function (id){
  const { modifiedCount } = await this.updateOne({_id: id}, {readAt: new Date()});
  return modifiedCount === 1;
}

NotificationSchema.plugin(HasFactory);

type IPlugin = {statics: {}, instance: {}} & IHasFactory;
export type INotification = Document & InferSchemaType<typeof NotificationSchema> & IPlugin["instance"] & {
  notifiable: Document;
}
type NotificationModel = Model<INotification> & IPlugin["statics"];
export default model<INotification, NotificationModel>("Notification", NotificationSchema);