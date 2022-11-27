import { Payment, Company } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import CustomFunction from "../../services/CustomFunction.js";

const date = CustomFunction.currentDate();
const time = CustomFunction.currentTime();

const AdminDashboardController = {

    async index(req, res, next){
        //show all companies
        let documents;
        try {
            documents = await Company.find({company_verify:true}).select('-password -createdAt -updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({status:200, data:documents});
    },

    async pendingVerifyPayment(req, res, next){
        let documents;
        try {
            documents = await Payment.aggregate([
                {
                    $match:{
                        $and:[
                            {"payment_status":true},
                            {"payment_verify":false}
                        ]
                        
                            // "payment_status":true,
                            // "payment_verify":false
                    }
                },
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'company_id',
                        foreignField: '_id',
                        as: 'companyData'
                    }
                },
                { $unwind: "$companyData" },
                {
                    $project:{
                        id:1,
                        transaction_id:1,
                        payment:1,
                        payment_date:1,
                        payment_time:1,
                        company_id:1,
                        company_name:"$companyData.company_name",
                        company_owner_name:"$companyData.name",
                        mobile:"$companyData.mobile",
                        email:"$companyData.email",
                    }
                }
                
            ]);

        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({status:200, data:documents});
    },

    async paymentVerify(req, res, next){

        const { id, company_id } = req.body;
        try {
            const exist = await Payment.exists({_id:id}).select('payment_verify');
            if (!exist) {
                return next(CustomErrorHandler.notExist('Not exist'));
            }
            if (exist.payment_verify === true) {
                return next(CustomErrorHandler.alreadyExist('Payment is already verified'));
            }
        } catch (err) {
            return next(err);
        }
        try {
            const pay_verify = await Payment.findByIdAndUpdate(
                {_id:id},
                {
                    payment_verify_date:date,
                    payment_verify_time:time,
                    payment_verify:true,
                },
                {new:true}
            );
            if (pay_verify) {
                await Company.findByIdAndUpdate(
                    {_id:company_id},
                    {
                        company_verify:true
                    },
                    {new:true}
                );
            }
        } catch (err) {
            return next(err);
        }
        res.send(CustomSuccessHandler.success('Payment verified successfully'));
    },

    async verifiedCompany(req, res, next){
        let documents;
        try {
            documents = await Payment.aggregate([
                {
                    $match:{
                        // "payment_status":true,
                        "payment_verify":true
                    }
                },
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'company_id',
                        foreignField: '_id',
                        as: 'companyData'
                    }
                },
                { $unwind: "$companyData" },
                {
                    $project:{
                        id:1,
                        transaction_id:1,
                        payment:1,
                        payment_date:1,
                        payment_time:1,
                        company_id:1,
                        company_name:"$companyData.company_name",
                        company_owner_name:"$companyData.name",
                        mobile:"$companyData.mobile",
                        email:"$companyData.email",
                    }
                }
                
            ]);

        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({status:200, data:documents});
    }

}

export default AdminDashboardController;