import Joi from "joi";

const assignWorkSchema = Joi.object({
    company_id:Joi.string().required(),
    project_id:Joi.string().required(),
    role_id:Joi.string().required(),
    user_id:Joi.string().required(),
    work:Joi.array().required(),
    exp_completion_date:Joi.string().required(),
    exp_completion_time:Joi.string().required(),
});

export default assignWorkSchema;