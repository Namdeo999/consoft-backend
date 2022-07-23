import Joi from 'joi';

const projectTeamSchema = Joi.object({
    project_id: Joi.string(),
    user_id: Joi.array().items(Joi.string().required()),
    // users: Joi.array(),
    
});

export default projectTeamSchema;