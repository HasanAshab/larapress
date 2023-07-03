import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
import HasFactory, { IHasFactory } from "app/plugins/HasFactory";

const AttachmentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  attachableId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  attachableType: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
},
{ timestamps: true }
);

NotificationSchema.virtual('attachable').get(function () {
  return mongoose.model(this.attachableType).findById(this.attachableId);
});


AttachmentSchema.plugin(HasFactory);

type IPlugin = {statics: {}, instance: {}} & IHasFactory;
export type IAttachment = Document & InferSchemaType<typeof AttachmentSchema> & IPlugin["instance"];
type AttachmentModel = Model<IAttachment> & IPlugin["statics"];
export default model<IAttachment, AttachmentModel>("Attachment", AttachmentSchema);