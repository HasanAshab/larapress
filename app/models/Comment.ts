import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
import HasFactory, { HasFactoryModel } from "app/plugins/HasFactory";
import Polymorphable from "app/plugins/Polymorphable";
import User, { IUser } from "app/models/User";
import Reply, { IReply } from "app/models/Reply";

const CommentSchema = new Schema({
  text: {
    required: true,
    type: String
  },
  commenterId: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: "User"
  }
},
{ 
  timestamps: true,
  methods: {
    reply(replier: Document, text: string) {
      return Reply.create({
        text,
        replierId: replier._id,
        replierType: (replier.constructor as any).modelName,
        commentId: this._id
      });
    }
  }
}
);

CommentSchema.virtual("replies").get(function () {
  return Reply.find({commentId: this._id});
});

CommentSchema.virtual("commenter").get(function () {
  return User.findById(this.commenterId);
});


CommentSchema.plugin(HasFactory);
CommentSchema.plugin(Polymorphable, "commentable");

export interface IComment extends Document, InferSchemaType<typeof CommentSchema> {
  commentable: Document;
  commenter: IUser;
  replies: IReply[];
  reply(replier: IUser, text: string): Promise<IReply>
};

interface CommentModel extends Model<IComment>, HasFactoryModel {}
export default model<IComment, CommentModel>("Comment", CommentSchema);