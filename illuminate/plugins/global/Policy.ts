import { base } from "helpers";
import { Schema, Document } from "mongoose";

const getPolicyFor = (modelName: string) => {
  const Policy = require(base(`app/policies/${modelName}Policy`)).default;
  return new Policy();
};

export default (schema: Schema) => {
  schema.statics.whereCan = function (action: string, performer: Document) {
    const policy = getPolicyFor(this.modelName);
    const filter = policy[action](performer);
    return this.find(
      Array.isArray(filter)
        ? {$or: filter}
        : filter
    );
  }
  
  schema.methods.can = function (action: string, target: Document) {
    const policy = getPolicyFor(target.constructor.modelName);
    const filters = policy[action](this);
    return (Array.isArray(filters))
      ? filters.some(filter => this.matchFilter(target, filter))
      : this.matchFilter(target, filters);
  };
  
  schema.methods.matchFilter = function (target: Document, filter: object) {
    for (const key in filter) {
      if (target[key] !== filter[key]) {
        return false;
      }
    }
    return true;
  };
}