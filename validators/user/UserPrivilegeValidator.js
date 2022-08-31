import Joi from "joi";

const userPrivilegeSchema = Joi.object({
    privilege: Joi.string().required()
});

export default userPrivilegeSchema;