import Joi from 'joi';

const checklistOptionTypeSchema = Joi.object({
    company_id: Joi.string().required(),
    option_type: Joi.string().required(),
});

export default checklistOptionTypeSchema;