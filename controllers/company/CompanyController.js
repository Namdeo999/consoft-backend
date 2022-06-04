import Joi from "joi";
import { Company } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";

// import transporter from "../../config/emailConfig.js";
// import { EMAIL_FROM } from "../../config/index.js";

const CompanyController = {
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

        const {company_name, pan, mobile, email} = req.body;
        const company = new Company({
            company_name,
            pan,
            mobile,
            email,
        });

        try {
            const result = await company.save();

            // let info = transporter.sendMail({
            //     from: EMAIL_FROM, // sender address
            //     to: 'namdeo.madhi@gmail.com', // list of receivers
            //     subject: "Hello", // Subject line
            //     text: "Hello world", // plain text body
            // });


            res.send(CustomSuccessHandler.success('Company created successfully'));
        } catch (err) {
            return next(err);
        }

    }
    
}

export default CompanyController;