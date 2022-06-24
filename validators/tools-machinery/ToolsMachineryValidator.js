import Joi from 'joi';

const ToolsMachinerySchema = Joi.object({
    tools_machinery_name: Joi.string().required(),
    
});

export default ToolsMachinerySchema;