import { model, Schema, Document } from "mongoose";
import { Model } from "~/core/mongoose";
import HasFactory, { HasFactoryModel } from "~/app/plugins/HasFactory";
import Attachable, { FileMeta, AttachableDocument } from "~/app/plugins/Attachable";

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
},
{ timestamps: true }
);

CategorySchema.plugin(HasFactory);
CategorySchema.plugin(Attachable, { icon: {} });


export interface ICategory {
  name: string;
  slug: string;
  icon: FileMeta | null;
}

export interface CategoryDocument extends Document, ICategory, AttachableDocument<ICategory> {};
interface CategoryModel extends Model<CategoryDocument>, HasFactoryModel {};

export default model<CategoryDocument, CategoryModel>("Category", CategorySchema);