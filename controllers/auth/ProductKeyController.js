import Joi from "joi";
import { ProductKey } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";

const ProductKeyController = {

    async verifyProductKey(req, res, next){
        const productKeySchema = Joi.object({
            company_id:Joi.string().required(),
            product_key:Joi.string().required(),
        });

        const {error} = productKeySchema.validate(req.body);
        if(error){
            return next(error);
        }
        try {
            const data = await ProductKey.findOne({company_id: req.body.company_id});
            if(!data){
                return next(CustomErrorHandler.notExist('Company not exist'));
            }
            // compare the password
            // const match = await compare(req.body.product_key, data.product_key);
            // const match = data.product_key.match(req.body.product_key);

            if(data.product_key !== req.body.product_key){
                return next(CustomErrorHandler.inValid('Product key invalid enter correct key'));
            }

            res.send(CustomSuccessHandler.success('Product key verified'));
           
        } catch (err) {
            return next(err);
        }

    },

}

export default ProductKeyController;