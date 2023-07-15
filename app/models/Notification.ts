import { model, QueryWithHelpers, HydratedDocument, Schema, Model, Document, InferSchemaType } from "mongoose";
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
{ 
  timestamps: true,
  query: {
    async markAsRead(id: string){
      const { modifiedCount } = await this.updateOne({_id: id}, {readAt: new Date()});
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



NotificationSchema.virtual('notifiable').get(function () {
  return model(this.notifiableType).findById(this.notifiableId);
});



NotificationSchema.plugin(HasFactory);

type IPlugin = {statics: {}, instance: {}} & IHasFactory;
export type INotification = Document & InferSchemaType<typeof NotificationSchema> & IPlugin["instance"] & {
  notifiable: Document;
  markAsRead(): Promise<void>;
}
export type NotificationQuery = QueryWithHelpers<HydratedDocument<INotification>[], HydratedDocument<INotification>, NotificationQueryHelpers>;
interface NotificationQueryHelpers {
  markAsRead(id: string): NotificationQuery
}

type NotificationModel = Model<INotification, NotificationQueryHelpers> & IPlugin["statics"];
export default model<INotification, NotificationModel>("Notification", NotificationSchema);