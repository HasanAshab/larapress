import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
import HasFactory, { HasFactoryModel } from "app/plugins/HasFactory";
import Polymorphable from "app/plugins/Polymorphable";
import { IUser } from "app/models/User";
import Comment, { IComment } from "app/models/Comment";

const ReplySchema = new Schema({
  commentId: {
    required: true,
    type: Schema.Types.ObjectId,
  },
  text: {
    required: true,
    type: String
  }
},
{ timestamps: true }
);

ReplySchema.virtual("comment").get(function () {
  return Comment.findById(this.commentId);
});

ReplySchema.plugin(HasFactory);
ReplySchema.plugin(Polymorphable, "replier");

export interface IReply extends Document, InferSchemaType<typeof ReplySchema> {
  replier: IUser;
  comment: IComment;
}

interface ReplyModel extends Model<IReply>, HasFactoryModel {};
export default model<IReply, ReplyModel>("Reply", ReplySchema);