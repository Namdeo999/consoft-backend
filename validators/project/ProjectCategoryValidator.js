import Joi from "joi";

const projectCategorySchema = Joi.object({
    company_id: Joi.string().required(),
    category_name: Joi.string().required(),
})

export default projectCategorySchema;