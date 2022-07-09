import Joi from 'joi';

const ToolsMachinerySchema = Joi.object({
    tools_machinery_name: Joi.string().required(),
    qty: Joi.number().required(),
    
});

export default ToolsMachinerySchema;