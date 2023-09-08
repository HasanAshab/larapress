import { Schema, Document } from "mongoose";

const getPolicyFor = async (modelName: string) => {
  const { default: Policy } = await import(`~/app/policies/${modelName}Policy`);
  return new Policy();
};

export default (schema: Schema) => {
  schema.methods.can = async function (action: string, target: Document) {
    const policy = await getPolicyFor((target.constructor as any).modelName);
    return await policy[action](this, target);
  };
}