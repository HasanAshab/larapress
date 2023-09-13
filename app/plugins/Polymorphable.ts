import { model, Schema, Document } from "mongoose";

export interface PolymorphableDocument<MorphTo extends Document, MorphToType extends string> extends Document {
  attachable: Promise<MorphTo>;
  [`${MorphToType}Id`]: Schema.Types.ObjectId;
  [`${MorphToType}Type`]: string;
}

export default (schema: Schema, morphToPath: string) => {
  schema.add({
    [`${morphToPath}Id`]: {
      required: true,
      type: Schema.Types.ObjectId
    },
    [`${morphToPath}Type`]: {
      required: true,
      type: String
    },
  });

  schema.virtual(morphToPath).get(function () {
    return model(this[`${morphToPath}Type`]).findById(this[`${morphToPath}Id`]);
  });
}