import Joi from "joi";

const userSchema = Joi.object({
    name: Joi.string().min(5).max(15).required().messages({
        "string.base":`"User Name" should be a type of 'text'`,
        "string.empty":`"User Name" cant be an empty`,
        "string.min":`"User Name" should have a minimum length of {#limit}`,
        "string.max":`"User Name" should have a maximum length of {#limit}`,
        "any.required":`"User Name" is a required`,
    }),
    email: Joi.string().email().required().messages({
        "string.base":`"Email" should be a type of 'text'`,
        "string.empty":`"Email" cant be an empty`,
        "any.required":`"Email" is a required`,
    }),
    mobile: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        "string.base":`"Mobile Number" should be a type of 'number'`,
        "string.pattern.base": `"Phone Number" must be a 10 digits number`,
        "string.empty":`"Mobile Number" cant be an empty`,
        "any.required":`"Mobile Number" is a required`,
    }),
    // password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    role_id: Joi.string().required().messages({
        "string.base":`"User Role" should be a type of 'text'`,
        "string.empty":`"User Role" cant be an empty`,
        "any.required":`"User Role" is a required`,
    }),
    user_privilege: Joi.string().required(),
    company_id: Joi.string().required().messages({
        "string.base":`"Company Name" should be a type of 'text'`,
        "string.empty":`"Company Name" cant be an empty`,
        "any.required":`"Company Name" is a required`,
    }),
    assign_project: Joi.boolean().required(),
    project_id: Joi.when('assign_project', { is: true, then: Joi.string().required().messages({
            "string.base":`"Project" cant be an empty`,
            "any.required":`"Project" is a required`,
        })
    })

    // project_id: Joi.string().messages({
    //     "string.base":`"Project" should be a type of 'text'`,
    //     "string.empty":`"Project" cant be an empty`,
    // }),//
    //repeat_password: Joi.ref('password')
})

export default userSchema;

// category_name: Joi.string().required().messages({
    //     "string.base": `"Project Category" should be a type of 'text'`,
    //     "string.empty": `"Project Category" cannot be an empty`,
    //     // "string.min": `"Project Category" should have a minimum length of {#limit}`,
    //     // "string.max": `"Project Category" should have a maximum length of {#limit}`,
    //     "any.required": `"Project Category" is a required`
    // }),

    // phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    //     "string.base": "Sorry! It looks like something went wrong. Please try later",
    //     "string.pattern.base": "Phone number must be a 10 digits number",
    //     "string.empty": "Phone Number is not allowed to be empty",
    //     "any.required": "Phone Number is required"
    // }),

    // conditional
    // Joi.object({
    //     name: Joi.string().required(),
    //     addr: Joi.string().when('name', { is: 'test', then: Joi.required() })
    //   })