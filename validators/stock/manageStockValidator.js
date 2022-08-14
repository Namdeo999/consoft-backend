import Joi from 'joi';

const manageStockSchema = Joi.object({
    company_id:Joi.string().required(),
    project_id:Joi.string().required(),
    user_id:Joi.string().required(),
    stockEntry:Joi.array().items( Joi.object().keys({
        key:Joi.number(),
        item_id:Joi.string().required(),
        unit_name:Joi.string().required(),
        qty:Joi.number().required(),
        location:Joi.string().required(),
        vehicle_no:Joi.string().required(),
    }) ),
});

export default manageStockSchema;