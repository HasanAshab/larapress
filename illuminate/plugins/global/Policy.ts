import { base } from "helpers";
import { Schema, Document } from "mongoose";

export default (schema: Schema) => {
  schema.statics.whereCan = function (action: string, performer: Document) {
    const Policy = require(base(`app/policies/${this.modelName}Policy`)).default;
    let filter = new Policy()[action](performer);
    return this.find(
      Array.isArray(filter)
        ? {$or: filter}
        : filter
    );
  }
}