import { Schema, Document } from "mongoose";


export default (schema: Schema) => {
  let policy: any;
  function importPolicyOnce(modelName: string) {
    if(policy) return;
    const Policy = require(`~/app/policies/${modelName}Policy`).default;
    policy = new Policy();
  };

  schema.methods.can = function (action: string, target: Document) {
    importPolicyOnce((target.constructor as any).modelName);
    return policy[action](this, target);
  };
}
