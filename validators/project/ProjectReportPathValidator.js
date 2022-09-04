import Joi from "joi";

const projectReportPathSchema = Joi.object().keys({
    company_id: Joi.string().required().error(new Error(`"Company Id" is required cant be an empty`)),
    project_id: Joi.string().required().error(new Error(`"Project Id" is required cant be an empty`)),
    started_by: Joi.string().required().error(new Error(`"Started By" is required cant be an empty` )),
    verification_1: Joi.string().required().error(new Error (`"Verification 1" is required cant be an empty`)),
    verification_2: Joi.string().required().error(new Error (`"Verification 2" is required cant be an empty`)),
    admin_3: Joi.string().required().error(new Error (`"Admin 3" is required cant be an empty`)),
    admin_2: Joi.string().required().error(new Error(`"Admin 2" is required cant be an empty`)),
    admin_1: Joi.string().required().error(new Error(`"Admin 1" is required cant be an empty`)),
    // category_name: Joi.string().required().messages({
    //     "string.base": `"Project Category" should be a type of 'text'`,
    //     "string.empty": `"Project Category" cannot be an empty`,
    //     // "string.min": `"Project Category" should have a minimum length of {#limit}`,
    //     // "string.max": `"Project Category" should have a maximum length of {#limit}`,
    //     "any.required": `"Project Category" is a required`
    // }),
    // category_name: Joi.string().required().error(new Error(`"Project Category" is required cant be an empty`)), //only single validation msg 
})

export default projectReportPathSchema;