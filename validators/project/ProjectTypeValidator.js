import Joi from "joi";

const projectTypeSchema = Joi.object({
    company_id:Joi.string().required(),
    category_id:Joi.string().required(),
    project_type:Joi.string().required(),
});

export default projectTypeSchema;