import { model, Schema, Document } from "mongoose";
import { Model } from "~/core/mongoose";
import HasFactory, { HasFactoryModel } from "~/app/plugins/HasFactory";

const ContactSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["opened", "closed"],
      default: "opened",
    }
  },
  { timestamps: true }
);

ContactSchema.index({ subject: 'text', message: 'text' });

ContactSchema.plugin(HasFactory);

export interface IContact {
  email: string;
  subject: string;
  message: string;
  status: "opened" | "closed";
};

export interface ContactDocument extends Document, IContact {};
interface ContactModel extends Model<ContactDocument>, HasFactoryModel {};

export default model<ContactDocument, ContactModel>("Contact", ContactSchema);