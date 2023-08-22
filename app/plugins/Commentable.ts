import { Schema, Document } from "mongoose";
import Comment, { IComment } from "app/models/Comment";
import { IUser } from "app/models/User";

export interface CommentableDocument extends Document {
  totalComments: Number;
  //comments: 
  comment(commenter: IUser, text: string): Promise<IComment>;
}

export interface CommentableModel {
  commentAt(id: string, commenter: IUser, text: string): Promise<IComment>;
}

export function isCommentableDocument(target: any): target is CommentableModel {
  return "totalComments" in target;
}

export default (schema: Schema) => {
  schema.add({
    totalComments: {
      type: Number,
      default: 0
    }
  });
  
  schema.virtual('comments').get(function () {
    return Comment.find({
      commentableId: this._id,
      commentableType: (this.constructor as any).modelName,
    });
  });
  
  schema.pre<CommentableDocument>(["deleteOne", "deleteMany"], function(next) {
    Comment.deleteMany({
      commentableId: this._id,
      commentableType: (this.constructor as any).modelName,
    }).then(() => next());
  });
  
  schema.statics.commentAt = function(id: string, commenter: IUser, text: string) {
    return Comment.create({
      text,
      commenterId: commenter._id,
      commenterType: (commenter.constructor as any).modelName,
      commentableId: id,
      commentableType: (this as any).modelName
    });
  }
  
  schema.methods.comment = function(commenter: IUser, text: string) {
    return Comment.create({
      text,
      commenterId: commenter._id,
      commenterType: (commenter.constructor as any).modelName,
      commentableId: this._id,
      commentableType: (this.constructor as any).modelName
    });
  }
}