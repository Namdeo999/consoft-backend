import Joi from 'joi';

const manageBoqSchema = Joi.object({
    company_id: Joi.string().required(),
    project_id: Joi.string().required(),
    item_id: Joi.string().required(),
    unit_id: Joi.string().required(),
    qty: Joi.string().required(),
});

export default manageBoqSchema;