import {
  model,
  Schema,
  Model,
  Document,
  InferSchemaType
} from "mongoose";
import HasFactory, { IHasFactory } from "app/plugins/HasFactory";
import Timestamps, { ITimestamps } from "app/plugins/Timestamps";

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

type IPlugin = IHasFactory & ITimestamps;
export type IMedia = Document & InferSchemaType<typeof MediaSchema> & IPlugin["instance"];
type MediaModel = Model<IMedia> & IPlugin["statics"];

export default model<IMedia, MediaModel>("Media", MediaSchema);