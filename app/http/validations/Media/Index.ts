import Joi from "joi";

static schema = {
  urlencoded: {
    target: 'params',
    rules: Joi.object({
      id: Joi.string().required(),
    })
  },
}