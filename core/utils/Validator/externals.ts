import { model } from "mongoose";

export function unique(modelName: string, field: string) {
  return async (value, helpers) => {
    return await model(modelName).exists({ [field]: value })
      ? helpers.error("string.unique")
      : value;
  }
}