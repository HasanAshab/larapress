import { Schema } from "mongoose";

export interface IMedia {
  name: string;
  path: string;
}

export const Media = new Schema<IMedia>({
  name: String,
  path: String
},
{ _id: false, timestamps: false }
);

Media.pre(["deleteOne", "deleteMany"], async function(next) {
  
});

