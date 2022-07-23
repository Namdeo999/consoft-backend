import Joi from "joi";
import { Company, RefreshToken, ProductKey } from "../../models/index.js";
import bcrypt from 'bcrypt';
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import CustomFunction from "../../services/CustomFunction.js";
import JwtService from "../../services/JwtService.js";
import { REFRESH_SECRET } from "../../config/index.js";

import transporter from "../../config/emailConfig.js";
import { EMAIL_FROM } from "../../config/index.js";

const CompanyController = {

    async companyLogin(req, res, next){
        const companySchema = Joi.object({
            mobile:Joi.number().required(),
            password: Joi.string().required(),
        });
        const {error} = companySchema.validate(req.body);

        if(error){
            return next(error);
        }

        try {
            const company = await Company.findOne({mobile: req.body.mobile});
            if(!company){
                return next(CustomErrorHandler.wrongCredentials())
            }

            const match = await bcrypt.compare(req.body.password,company.password);
            if (!match) {
                return next(CustomErrorHandler.wrongCredentials());
            }

            const access_token = JwtService.sign({ _id: company._id });
            const refresh_token = JwtService.sign({ _id: company._id }, '1y', REFRESH_SECRET);

            await RefreshToken.create({ token: refresh_token });
            
            res.json({status:200, access_token, refresh_token, _id: company._id, company_name: company.company_name, mobile:company.mobile, email:company.email});
            
        } catch (err) {
            return next(err);
        }
    },

    async index(req, res, next){
        let ducument;
        try {
            ducument = await Company.findOne({_id:req.company._id}).select('-password -role -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(ducument);
    },

    async store(req, res, next){
        const companySchema = Joi.object({
            company_name:Joi.string().required(),
            //pan:Joi.string().required(),
            mobile:Joi.number().required(),
            email:Joi.string().required(),
            // password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        });

        const {error} = companySchema.validate(req.body);
        if(error){
            return next(error);
        }

        try {
            const exist = await Company.exists({mobile:req.body.mobile});
            if(exist){
                return next(CustomErrorHandler.alreadyExist('Mobile no is already axist'));                
            }
        } catch (err) {
            return next(err);
        }

        try {
            const exist = await Company.exists({email:req.body.email});
            if(exist){
                return next(CustomErrorHandler.alreadyExist('Email is already axist'));
            }
        } catch (err) {
            return next(err);
        }
        // const pass12 = GenerateRandomString.stringPassword(6);
        const password = CustomFunction.stringPassword(6);
        
        // const password = stringPassword(8);
        // Hash password
        // const hashedPassword = await bcrypt.hash(data, 10);
        
        const {company_name, mobile, email} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        // const hashedPassword = await bcrypt.hash(pass.message, 10);

        const company = new Company({
            company_name,
            mobile,
            email,
            password: hashedPassword,
        });

        try {
            const result = await company.save();
            if (result) {
                
                const product_key = new ProductKey({
                    company_id:result._id,
                    product_key:password,
                });

                try {
                    const product_key_data = await product_key.save();
                } catch (err) {
                    return next(err);
                }

            }

            let info = transporter.sendMail({
                from: EMAIL_FROM, // sender address
                to: email, // list of receivers
                subject: "Login Password and Product Key", // Subject line
                text: " Password and product key " + password, // plain text body
            });

            // res.json({ access_token:access_token });

            // res.send(CustomSuccessHandler.success('Company created successfully'));

            res.json({
                status:200, 
                _id:result._id, 
                company_name:result.company_name, 
                mobile:result.mobile, 
                email:result.email, 
                message:'Company created successfully'
            });
        } catch (err) {
            return next(err);
        }
    }
    
}

// function stringPassword(len){
//     var gen_pass = "";
//     var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

//     for( var i=0; i < len; i++ ){
//         gen_pass +=charset.charAt(Math.floor(Math.random()*charset.length));
//     }
//     return gen_pass;
// }



export default CompanyController;