import {
  model,
  Schema,
  Document,
  InferSchemaType
} from "mongoose";
import {
  log
} from "helpers";

import HasFactory, { IHasFactory } from "app/traits/HasFactory";
import Timestamps, { ITimestamps } from "app/traits/Timestamps";

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

MediaSchema.plugin(HasFactory);
MediaSchema.plugin(Timestamps);

type IPlugins = IHasFactory & ITimestamps;
export interface IMedia extends Document, InferSchemaType<typeof MediaSchema>, IPlugins {};
export default model<IMedia>("Media", MediaSchema);