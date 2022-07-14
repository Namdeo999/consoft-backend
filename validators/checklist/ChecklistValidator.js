import Joi from 'joi';

const checklistSchema = Joi.object({
    company_id: Joi.string().required(),
    checklist_name: Joi.string().required(),
    checklist_option_type_id: Joi.required(),
    checklist_item: Joi.required(),
});

export default checklistSchema;