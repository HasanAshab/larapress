import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
import HasFactory, { HasFactoryModel } from "app/plugins/HasFactory";
import User, { IUser } from "app/models/User";
import Comment, { IComment } from "app/models/Comment";

const ReplySchema = new Schema({
  commentId: {
    required: true,
    type: Schema.Types.ObjectId,
  },
  replierId: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: "User"
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

ReplySchema.virtual("replier").get(function () {
  return User.findById(this.replierId);
});

ReplySchema.plugin(HasFactory);

export interface IReply extends Document, InferSchemaType<typeof ReplySchema> {
  replier: IUser;
  comment: IComment;
}

interface ReplyModel extends Model<IReply>, HasFactoryModel {};
export default model<IReply, ReplyModel>("Reply", ReplySchema);