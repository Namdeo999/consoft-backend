import Joi from "joi";

const supplierSchema = Joi.object({
    company_id:Joi.string().required(),
    supplier_name:Joi.string().required(),
    supplier_mobile:Joi.number().required(),
    supplier_location:Joi.string().required(),
});

export default supplierSchema;
