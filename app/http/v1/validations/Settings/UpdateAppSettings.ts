import { ValidationSchema } from "types";
import config from "config";
import Joi from "joi";

const parseFields = function(obj) {
  const fields: Record<string, ReturnType<typeof Joi.string>> = {};
  if(typeof obj !== "object") return Joi.string();
  for(const key of Object.keys(obj)){
    fields[key] = parseFields(obj[key])
  }
  return fields;
}

const schema: ValidationSchema = {
  urlencoded: {
    target: "body",
    rules: Joi.object(parseFields(config))
  }
}


export default schema;