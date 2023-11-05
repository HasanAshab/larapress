import { model } from "mongoose";
import { CustomValidator } from "joi";

export function unique(modelName: string, field: string) :CustomValidator {
  return async (value, helpers) => {
    return await model(modelName).exists({ [field]: value })
      ? helpers.error("string.unique")
      : value;
  }
}