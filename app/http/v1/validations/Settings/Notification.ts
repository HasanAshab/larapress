import { ValidationSchema } from "types";
import Joi from "joi";
import notificationConfig from "register/notification";

const channelsSchemaData: any = {}
for(const channel of notificationConfig.channels){
  channelsSchemaData[channel] = Joi.boolean();
}
const channelsSchema = Joi.object(channelsSchemaData);

const fields: any = {};
for(const notificationType of notificationConfig.types){
  fields[notificationType] = channelsSchema;
}

const schema: ValidationSchema = {
  urlencoded: {
    target: "body",
    rules: Joi.object(fields)
  }
}


export default schema;