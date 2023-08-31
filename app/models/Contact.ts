import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
import HasFactory, { HasFactoryModel } from "~/app/plugins/HasFactory";

const ContactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

ContactSchema.plugin(HasFactory);


export interface IContact extends Document, InferSchemaType<typeof ContactSchema> {};
interface ContactModel extends Model<IContact>, HasFactoryModel {};
export default model<IContact, ContactModel>("Contact", ContactSchema);