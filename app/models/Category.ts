import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
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


export interface ICategory extends Document, InferSchemaType<typeof CategorySchema>, AttachableDocument {
  icon: FileMeta | null;
};
interface CategoryModel extends Model<ICategory>, HasFactoryModel {};
export default model<ICategory, CategoryModel>("Category", CategorySchema);