import Joi from "joi";
import { Company } from "../../models/index.js";
import bcrypt from 'bcrypt';
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import GenerateRandomString from "../../services/GenerateRandomString.js";

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

            const match = await bcrypt.compare(password, company.password);
            if (!match) {
                return next(CustomErrorHandler.wrongCredentials());
            }
            console.log(match);
            return false;
            
        } catch (err) {
            return next(err);
        }
    },

    async index(req, res, next){
        let companies;
        try {
            companies = await Company.find().select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(companies);
    },

    async store(req, res, next){
        const companySchema = Joi.object({
            company_name:Joi.string().required(),
            pan:Joi.string().required(),
            mobile:Joi.number().required(),
            email:Joi.string().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
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
        
        // const pass = GenerateRandomString.stringPassword(6);
        // const salt = await bcrypt.genSalt(10)
        // const hashedPassword = await bcrypt.hash(pass.message, salt);

        // const hashedPassword = await bcrypt.hash(pass.message, 10);
        
        
        // Hash password
        // const hashedPassword = await bcrypt.hash(data, 10);
        
        const {company_name, pan, mobile, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const company = new Company({
            company_name,
            pan,
            mobile,
            email,
            password: hashedPassword,
        });

        try {

            let info = transporter.sendMail({
                from: EMAIL_FROM, // sender address
                to: email, // list of receivers
                subject: "Login Password", // Subject line
                text: req.body.password, // plain text body
            });
            
            const result = await company.save();

            res.send(CustomSuccessHandler.success('Company created successfully'));
        } catch (err) {
            return next(err);
        }
    }
    
}

export default CompanyController;