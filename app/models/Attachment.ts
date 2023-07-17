import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
import HasFactory, { HasFactoryModel } from "app/plugins/HasFactory";
import { IUser } from "app/models/User";
import Polymorphable from "app/plugins/Polymorphable";

const AttachmentSchema = new Schema({
  name: {
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


AttachmentSchema.plugin(HasFactory);
AttachmentSchema.plugin(Polymorphable, "attachable");

export interface IAttachment extends Document, InferSchemaType<typeof AttachmentSchema> {
  attachable: IUser;
}

interface AttachmentModel extends Model<IAttachment>, HasFactoryModel {} ;
export default model<IAttachment, AttachmentModel>("Attachment", AttachmentSchema);