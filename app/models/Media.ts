import {
  model,
  Schema,
  InferSchemaType
} from 'mongoose';
import {
  log
} from "helpers";
import {
  promises as fs
} from "fs";
import Timestamps, {
  ITimestamps
} from "app/traits/Timestamps";

const MediaSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  mediableId: {
    type: Schema.Types.ObjectId,
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


MediaSchema.pre(['remove', 'deleteOne', 'findOneAndDelete', 'deleteMany'], {document: true}, async function() {
  if (process.env.NODE_ENV !== "test") {
    try {
      await fs.unlink(this.path);
    }
    catch(err: any) {
      log(err);
    }
  }
});

MediaSchema.plugin(Timestamps);

export type IMedia = InferSchemaType < typeof MediaSchema > & ITimestamps;
export default model("Media", MediaSchema);