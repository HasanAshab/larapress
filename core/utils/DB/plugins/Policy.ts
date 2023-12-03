import { Schema, Document } from "mongoose";
import { constructor } from "types";

/**
 * Plugin to add access controll to document
*/
export default function Policy(schema: Schema, Policy: constructor) {
  const policy = new Policy();

  schema.methods.can = function (action: string, target: Document) {
    return policy[action](this, target);
  };
}
