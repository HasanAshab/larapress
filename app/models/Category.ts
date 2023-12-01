import { model, Schema, Document, Model } from "mongoose";
import HasFactory, { HasFactoryModel } from "~/app/plugins/HasFactory";
import Mediable, { MediableDocument } from "~/app/plugins/Mediable";

const CategorySchema = new Schema<CategoryDocument>(
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
  icon: Schema.Types.ObjectId
},
{ timestamps: true }
);

CategorySchema.plugin(HasFactory);
CategorySchema.plugin(Mediable);


export interface ICategory {
  name: string;
  slug: string;
}

export interface CategoryDocument extends Document, ICategory, MediableDocument {};
interface CategoryModel extends Model<CategoryDocument>, HasFactoryModel {};

export default model<CategoryDocument, CategoryModel>("Category", CategorySchema);