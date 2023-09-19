import { ValidationSchema } from "types";
import Joi from "joi";
import { channels, types } from "~/register/notification";

const channelsSchema: any = {}
for(const channel of channels){
  channelsSchema[channel] = Joi.boolean();
}

const fields: any = {};
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