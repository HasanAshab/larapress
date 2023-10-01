import { Schema, Document } from "mongoose";
import { res } from "~/core/express";

export default (schema: Schema) => {
  schema.statics.findByIdOrFail = 
  schema.statics.findOrFail =
}