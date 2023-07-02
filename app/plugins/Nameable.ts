import { Schema } from "mongoose";

export interface NameableDocument {
  modelName: string;
}

export default (schema: Schema) => {
  schema.add({
    modelName: {
      type: String,
      default: function () {
        return (this.constructor as any).modelName;
      }
    }
  })
}