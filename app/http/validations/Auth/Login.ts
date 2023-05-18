import Joi from "joi";

const schema = {
  urlencoded: {
    target: 'body',
    rules: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    })
  }
}


export default schema;