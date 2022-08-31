import Joi from "joi";

const manpowerCategorySchema = Joi.object({
    company_id:Joi.string().required(),
    project_id:Joi.string().required(),
    contractor_id:Joi.string().required(),
    manpower_category:Joi.string().required()
})

export default manpowerCategorySchema;