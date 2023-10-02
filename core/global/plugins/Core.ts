import { Schema, Model, Document } from "mongoose";
import { res } from "~/core/express";

export default (schema: Schema) => {
  schema.statics.findOneOrFail = async function(...args: Parameters<Model<Document>["findOne"]>) {
    return await this.findOne(...args) 
      ?? res.status(404).message();
  }
  schema.statics.findByIdOrFail = async function(id: string) {
    return await this.findById(id)
      ?? res.status(404).message();
  }
}