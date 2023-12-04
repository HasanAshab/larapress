import { Schema, Document } from "mongoose";
import { constructor } from "types";

interface HasPolicyDocument<Policy> extends Document {
  can<Action extends keyof Policy>(action: Action, target: Parameters<Policy[Action]>[1]): boolean;
  cannot<Action extends keyof Policy>(action: Action, target: Parameters<Policy[Action]>[1]): boolean;
}

/**
 * Plugin to add access controll to document
*/
export default function HasPolicy(schema: Schema, Policy: constructor) {
  const policy = new Policy();

  schema.methods.can = function (action: string, target: Document) {
    return policy[action](this, target);
  };
  
  schema.methods.cannot = function (action: string, target: Document) {
    return !this.can(action, target);
  };
}
