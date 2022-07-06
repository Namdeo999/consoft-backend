import Joi from "joi";

const projectSchema = Joi.object({
    company_id: Joi.string().required(),
    project_name: Joi.string().min(5).max(50).required(),
    project_location: Joi.string().required(),
    project_category: Joi.string().required(),
    project_type: Joi.string().required(),
    project_area: Joi.number().required(),
    project_measurement: Joi.string().required(),
})

export default projectSchema;