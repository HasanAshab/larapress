import { Schema, Document } from "mongoose";
import Comment from "app/models/Comment";

export interface CommentableDocument extends Document {
  totalComments: Number;
  comment(text: string): Promise<void>;
}

export default (schema: Schema) => {
  schema.add({
    totalComments: {
      type: Number,
      default: 0
    }
  });
  /*
  schema.statics.comment = function(id: string, text: string) {
    Comment.create({
      text,
      commenterId: 
    });
  }
  
  schema.methods.comment = function(text: string) {
    
  }*/
}