import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
import HasFactory, { HasFactoryModel } from "app/plugins/HasFactory";
import Polymorphable from "app/plugins/Polymorphable";
import { IUser } from "app/models/User";
import Reply, { IReply } from "app/models/Reply";

const CommentSchema = new Schema({
  text: {
    required: true,
    type: String
  }
},
{ 
  timestamps: true,
  
  statics: {
    
  },
  
  methods: {
    reply(replier: Document, text: string) {
      return Reply.create({
        text,
        replierId: replier._id,
        replierType: (commenter.constructor as any).modelName,
        commentId: this._id
      });
    }
  }
}
);

CommentSchema.virtual("replies").get(function () {
  return Reply.find({commentId: this._id});
});



CommentSchema.plugin(HasFactory);
CommentSchema.plugin(Polymorphable, "commentable");
CommentSchema.plugin(Polymorphable, "commenter");

export interface IComment extends Document, InferSchemaType<typeof CommentSchema> {
  commentable: Document;
  commenter: IUser;
  replies: IReply[];
  reply(replier: IUser, text: string): Promise<IReply>
};

interface CommentModel extends Model<IComment>, HasFactoryModel {
  replyAt(id: string, replier: IUser, text: string): Promise<IReply>
}
export default model<IComment, CommentModel>("Comment", CommentSchema);