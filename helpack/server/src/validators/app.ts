import Joi from 'joi';

export const userMarkInfoSchema = Joi.object({
  name: Joi.string(),
  ver: Joi.string(),
  desc: Joi.string(),
});
