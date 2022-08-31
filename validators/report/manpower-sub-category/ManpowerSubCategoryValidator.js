import Joi from "joi";

const manpowerSubCategorySchema = Joi.object({
    company_id:Joi.string().required(),
    manpower_category_id:Joi.string().required(),
    manpower_sub_category:Joi.string().required()
})

export default manpowerSubCategorySchema;