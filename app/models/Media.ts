import { model, Schema, InferSchemaType } from 'mongoose';
import { log } from "helpers";
import { unlink } from "fs";
import Timestamps, { ITimestamps } from "app/traits/Timestamps";

const MediaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  mediableId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  mediableType: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
});


MediaSchema.pre(['remove', 'deleteOne', 'findOneAndDelete', 'deleteMany'], function(next) {
  if (process.env.NODE_ENV !== "test") {
    unlink(this.path, () => log(err));
  }
  next();
});


MediaSchema.plugin(Timestamps);

export type IMedia = InferSchemaType<typeof MediaSchema> & ITimestamps;
export default model("Media", MediaSchema);