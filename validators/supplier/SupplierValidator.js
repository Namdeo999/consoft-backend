import Joi from "joi";

const supplierSchema = Joi.object({
    supplier_name:Joi.string().required(),
    supplier_mobile:Joi.number().required(),
    supplier_email:Joi.string().email().required(),
    supplier_location:Joi.string().required(),
});

export default supplierSchema;
