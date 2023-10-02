import Joi, { AnySchema } from "joi";
import helpers from "./extentions/helpers";
import formData from "./extentions/form-data";

const passwordPatterns = {
  strong: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/,
  medium: /(?=.*[a-zA-Z])(?=.*[0-9])(?=.{6,})/,
  weak: /(?=.{6,})/,
};



export default Joi.extend(helpers, formData);


export * from "./externals";


