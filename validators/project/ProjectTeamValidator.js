import Joi from 'joi';

const projectTeamSchema = Joi.object({
    company_id: Joi.string().required(),
    project_id: Joi.string().required(),
    // user_id: Joi.required(),
    user_id: Joi.array().items(Joi.string().required()),
    // users: Joi.array(),
    
});

export default projectTeamSchema;