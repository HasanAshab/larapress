import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
import HasFactory, { HasFactoryModel } from "app/plugins/HasFactory";
import Commentable, { CommentableDocument, CommentableModel } from "app/plugins/Commentable";
//import Voteable, { VoteableDocument } from "app/plugins/Voteable";
import Polymorphable from "app/plugins/Polymorphable";
import { IUser } from "app/models/User";

const BlogSchema = new Schema(
{
  title: {
    required: true,
    type: String
  },
  content: {
    required: true,
    type: String
  },
  slug: {
    required: true,
    type: String,
    unique: true
  },
  categoryId: {
    required: true,
    type: String
  },
  visibility: {
    required: true,
    type: String,
    enum: ["public", "private"]
  }
},
{ timestamps: true }
);

BlogSchema.plugin(HasFactory);
BlogSchema.plugin(Commentable);
BlogSchema.plugin(Polymorphable, "author");
//BlogSchema.plugin(Voteable);

export interface IBlog extends Document, InferSchemaType<typeof BlogSchema>, CommentableDocument {
  author: IUser;
};

interface BlogModel extends Model<IBlog>, HasFactoryModel, CommentableModel {};
export default model<IBlog, BlogModel>("Blog", BlogSchema);