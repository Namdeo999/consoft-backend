import Joi from 'joi';

const checklistOptionTypeSchema = Joi.object({
    option_type: Joi.string().required(),
});

export default checklistOptionTypeSchema;