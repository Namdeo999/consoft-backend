import Joi from "joi";

const userSchema = Joi.object({
    name: Joi.string().min(5).max(15).required(), 
    email: Joi.string().email().required(),
    mobile: Joi.number().min(10).required(),
    // password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    role_id: Joi.string().required(),
    company_id: Joi.string().required(),//
    project_id: Joi.string()//
    //repeat_password: Joi.ref('password')
})

export default userSchema;