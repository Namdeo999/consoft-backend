import Joi from "joi";

const projectCategorySchema = Joi.object().keys({
    company_id: Joi.string().required(),
    // category_name: Joi.string().required().messages({
    //     "string.base": `"Project Category" should be a type of 'text'`,
    //     "string.empty": `"Project Category" cannot be an empty`,
    //     // "string.min": `"Project Category" should have a minimum length of {#limit}`,
    //     // "string.max": `"Project Category" should have a maximum length of {#limit}`,
    //     "any.required": `"Project Category" is a required`
    // }),
    category_name: Joi.string().required().error(new Error(`"Project Category" is required cant be an empty`)), //only single validation msg 
})

export default projectCategorySchema;