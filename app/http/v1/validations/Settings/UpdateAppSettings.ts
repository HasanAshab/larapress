import { ValidationSchema } from "types";
import Config from "Config";
import Joi from "joi";

const parseFields = function(obj: any) {
  const fields: any = {};
  if(typeof obj !== "object") return Joi.string();
  for(const key of Object.keys(obj)){
    fields[key] = parseFields(obj[key])
  }
  return fields;
}

const schema: ValidationSchema = {
  urlencoded: {
    target: "body",
    rules: Joi.object(parseFields(Config.get()))
  }
}


export default schema;