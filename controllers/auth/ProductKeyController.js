import Joi from "joi";
import { ProductKey, RefreshToken } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import JwtService from "../../services/JwtService.js";
import { REFRESH_SECRET } from "../../config/index.js";

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

            const access_token = JwtService.sign({ _id: data.company_id });
            const refresh_token = JwtService.sign({ _id: data.company_id }, '1y', REFRESH_SECRET);

            await RefreshToken.create({ token: refresh_token });
            // res.json({ access_token, refresh_token, id: user._id, role: user.role });

            res.json({
                status:200,
                _id:data._id,
                access_token,
                refresh_token,
                message:'Product key verified'
            });

            // res.send(CustomSuccessHandler.success('Product key verified'));
           
        } catch (err) {
            return next(err);
        }

    },

}

export default ProductKeyController;