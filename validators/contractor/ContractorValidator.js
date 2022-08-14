import Joi from 'joi';

const contractorSchema = Joi.object({
    company_id: Joi.string().required(),
    project_id: Joi.string().required(),
    contractor_name: Joi.string().required(),
    phone_no: Joi.number().required(),
});

export default contractorSchema;