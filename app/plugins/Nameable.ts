import { Schema } from "mongoose";

export type INameable = {
  instance: {
    modelName: string;
  }
}

export default (schema: Schema) => {
  schema.add({
    modelName: {
      type: String,
      default: function () {
        return this.constructor.modelName;
      }
    }
  })
}