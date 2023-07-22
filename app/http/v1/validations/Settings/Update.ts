import { ValidationSchema } from "types";
import { env, toCamelCase } from "helpers";
import Joi from "joi";

const fields: Record<string, ReturnType<typeof Joi.string>> = {};
for(const key of Object.keys(env())){
  fields[toCamelCase(key.toLowerCase())] = Joi.string();
}

const schema: ValidationSchema = {
  urlencoded: {
    target: "body",
    rules: Joi.object(fields)
  }
}


export default schema;