import { ValidationSchema } from "types";
import Joi from "joi";
import twilio from "twilio";

const schema: ValidationSchema = {
  urlencoded: {
    target: "body",
    rules: Joi.object({
      method: Joi.string().valid("sms", "call"),
      phoneNumber: Joi.string().external(async (phoneNumber) => {
        const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
        try {
          const response = await client.lookups.phoneNumbers(phoneNumber).fetch();
          return response.phoneNumber;
        }
        catch {
          throw new Error("Invalid phone number!");
        }
      })
    }),
  },
};

export default schema;
