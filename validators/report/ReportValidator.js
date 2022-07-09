import Joi from 'joi';

const reportSchema = Joi.object({
    project_id:Joi.string().required(),
    user_id:Joi.string().required(),
});

export default reportSchema;