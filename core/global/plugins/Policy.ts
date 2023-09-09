import { Schema, Document } from "mongoose";


export default (schema: Schema) => {
  let policy;
  function importPolicy(modelName: string) {
    if(Policy) return;
    const Policy = require(`~/app/policies/${modelName}Policy`).default;
    policy = new Policy();
  };

  schema.methods.can = async function (action: string, target: Document) {
    importPolicy((target.constructor as any).modelName);
    return await policy[action](this, target);
  };
}
