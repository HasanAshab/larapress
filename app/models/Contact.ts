import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
import HasFactory, { HasFactoryModel } from "~/app/plugins/HasFactory";

const ContactSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
      text: true
    },
    message: {
      type: String,
      required: true,
      text: true
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    }
  },
  { timestamps: true }
);

ContactSchema.plugin(HasFactory);


export interface IContact extends Document, InferSchemaType<typeof ContactSchema> {};
interface ContactModel extends Model<IContact>, HasFactoryModel {};
export default model<IContact, ContactModel>("Contact", ContactSchema);