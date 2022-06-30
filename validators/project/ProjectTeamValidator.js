import Joi from 'joi';

const projectTeamSchema = Joi.object({
    project_id: Joi.string(),
    user_id: Joi.string(),
    
});

export default projectTeamSchema;