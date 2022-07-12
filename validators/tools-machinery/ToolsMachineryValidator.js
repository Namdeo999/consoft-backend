import Joi from 'joi';

const toolsMachinerySchema = Joi.object({
    company_id: Joi.string().required(),
    tools_machinery_name: Joi.string().required(),
    qty: Joi.number().required(),
    
});

export default toolsMachinerySchema;