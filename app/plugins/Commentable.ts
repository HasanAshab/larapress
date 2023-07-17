import { Schema, Document } from "mongoose";

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
  
  schema.statics.example = function() {
    //
  }
  
  schema.methods.example = function() {
    //
  }
}