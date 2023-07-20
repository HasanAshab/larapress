import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
import HasFactory, { HasFactoryModel } from "app/plugins/HasFactory";
import Attachable, { AttachableDocument } from "app/plugins/Attachable";

const CategorySchema = new Schema(
{
  name: {
    required: true,
    type: String
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  iconUrl: {
    type: String,
    default: null
  }
},
{ timestamps: true }
);

CategorySchema.plugin(HasFactory);
CategorySchema.plugin(Attachable);


export interface ICategory extends Document, InferSchemaType<typeof CategorySchema>, AttachableDocument {};
interface CategoryModel extends Model<ICategory>, HasFactoryModel {};
export default model<ICategory, CategoryModel>("Category", CategorySchema);