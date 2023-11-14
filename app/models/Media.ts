import { model, Schema, Document, Model } from "mongoose";
import HasFactory, { HasFactoryModel } from "~/app/plugins/HasFactory";
import Storage from "Storage";

const MediaSchema = new Schema<MediaDocument>(
{
  mediableId: {
    type: Schema.Types.ObjectId,
    required: true,
  }, 
  mediableType: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true
  },
  visibility: {
    type: String,
    enum: ["public", "private"],
    default: "public"
  }
},
{ timestamps: true }
);


MediaSchema.post(["deleteOne", "deleteMany"], async function(next) {
  console.log(this)
  //Storage.delete()
});


MediaSchema.plugin(HasFactory);


export interface IMedia {
  mediableId: Schema.Types.ObjectId;
  mediableType: string;
  tag: string;
  path: string;
  visibility: "public" | "private";
}

export interface MediaModel extends Document, IMedia {};
interface MediaModel extends Model<MediaDocument> {};

export default model<MediaDocument, MediaModel>("Media", MediaSchema);

