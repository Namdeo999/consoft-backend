import Joi from "joi";

const userRoleSchema = Joi.object({
    company_id: Joi.string().required(),
    user_role: Joi.string().required(),
})

export default userRoleSchema;
