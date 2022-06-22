import Joi from 'joi';

const checklistOptionSchema = Joi.object({
    option_type_id: Joi.string().required(),
    checklist_option: Joi.string().required(),
});

export default checklistOptionSchema;