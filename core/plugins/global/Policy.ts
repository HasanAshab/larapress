import { Schema, Document } from "mongoose";

const getPolicyFor = async (modelName: string) => {
  const { default: Policy } = await import(`~/app/policies/${modelName}Policy`);
  return new Policy();
};

export default (schema: Schema) => {
  schema.methods.can = async function (action: string, target: Document) {
    const policy = await getPolicyFor((target.constructor as any).modelName);
    const filters = policy[action](this);
    return (Array.isArray(filters))
      ? filters.some(filter => this.matchFilter(target, filter))
      : this.matchFilter(target, filters);
  };
  
  schema.methods.matchFilter = function (target: Record<string, any>, filter: Record<string, any>) {
    for (const key in filter) {
      if (target[key].toString() !== filter[key].toString()) {
        return false;
      }
    }
    return true;
  };
}