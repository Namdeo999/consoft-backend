import Joi from 'joi';

const qualityTypeSchema = Joi.object({
    type:Joi.string().required(),
});

export default qualityTypeSchema;