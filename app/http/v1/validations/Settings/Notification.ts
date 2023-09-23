import { ValidationSchema } from "types";
import Joi from "joi";
import config from "config";

const { channels, types } = config.get("notification");
const channelsSchema: Record<string, unknown> = {}
const fields: Record<string, unknown> = {};

for(const channel of channels){
  channelsSchema[channel] = Joi.boolean();
}
for(const notificationType of types){
  fields[notificationType] = channelsSchema;
}

const schema: ValidationSchema = {
  urlencoded: {
    target: "body",
    rules: Joi.object(fields)
  }
}


export default schema;