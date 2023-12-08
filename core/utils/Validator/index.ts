import Joi, { AnySchema } from "joi";
import helpers from "./extentions/helpers";
import formData from "./extentions/form-data";

//@ts-ignore
export default Joi.extend(helpers, formData);

export * from "./externals";

export const ValidationError = Joi.ValidationError;