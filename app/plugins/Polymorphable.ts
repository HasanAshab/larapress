import { model, Schema, Document } from "mongoose";


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