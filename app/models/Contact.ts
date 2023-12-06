import { model, Schema, Document, Model } from "mongoose";
import HasFactory, { HasFactoryModel } from "~/app/plugins/HasFactory";
import Searchable, { SearchableDocument } from "~/app/plugins/Searchable";

const ContactSchema = new Schema<ContactDocument>(
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
  { 
    timestamps: { createdAt: true, updatedAt: false } 
  }
);

ContactSchema.index({ subject: 'text', message: 'text' });

ContactSchema.plugin(HasFactory);
ContactSchema.plugin(Searchable);

export interface IContact {
  email: string;
  subject: string;
  message: string;
  status: "opened" | "closed";
};

export interface ContactDocument extends Document, IContact, SearchableDocument {};
interface ContactModel extends Model<ContactDocument>, HasFactoryModel {};

export default model<ContactDocument, ContactModel>("Contact", ContactSchema);