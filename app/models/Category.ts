import mongoose from "mongoose";
import HasFactory, { HasFactoryModel } from "~/app/plugins/HasFactory";
import Mediable, { MediableDocument } from "~/app/plugins/Mediable";

const CategorySchema = new mongoose.Schema<CategoryDocument>({
  name: {
    required: true,
    type: String
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  icon: {
    required: true,
    type: String
  }
});

CategorySchema.plugin(HasFactory);
CategorySchema.plugin(Mediable);


export interface ICategory {
  name: string;
  slug: string;
  icon: string;
}

export interface CategoryDocument extends mongoose.Document, ICategory, MediableDocument {};
interface CategoryModel extends mongoose.Model<CategoryDocument>, HasFactoryModel {};

export default mongoose.model<CategoryDocument, CategoryModel>("Category", CategorySchema);