import { model, QueryWithHelpers, HydratedDocument, Schema, Model, Document, InferSchemaType } from "mongoose";
import HasFactory, { HasFactoryModel } from "~/app/plugins/HasFactory";
import Polymorphable from "~/app/plugins/Polymorphable";
import { IUser } from "~/app/models/User";

const AttachmentSchema = new Schema({
  name: {
    required: true,
    type: String
  },
  mimetype: {
    required: true,
    type: String
  },
  path: {
    required: true,
    type: String
  },
  link: {
    required: true,
    type: String
  }
},
{ timestamps: true }
);


AttachmentSchema.plugin(HasFactory);
AttachmentSchema.plugin(Polymorphable, "attachable");

export interface IAttachment extends Document, InferSchemaType<typeof AttachmentSchema> {
  attachableId: Schema.Types.ObjectId;
  attachableType: string;
  attachable: IUser;
}

export type AttachmentQuery = QueryWithHelpers<HydratedDocument<IAttachment>[], HydratedDocument<IAttachment>>;
interface AttachmentModel extends Model<IAttachment>, HasFactoryModel {} ;
export default model<IAttachment, AttachmentModel>("Attachment", AttachmentSchema);