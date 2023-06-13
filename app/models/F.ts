import { model, Schema, Document, InferSchemaType } from "mongoose";
import Timestamps, { ITimestamps } from "app/traits/Timestamps";

const FSchema = new Schema({
  //
});

FSchema.plugin(Timestamps);

export interface IF extends Document, InferSchemaType<typeof FSchema>, ITimestamps {};

export default model<IF>("F", FSchema);