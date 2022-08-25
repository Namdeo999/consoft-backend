import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import CustomFunction from "../../services/CustomFunction.js";
import { reportSchema } from "../../validators/index.js";
import { Report } from "../../models/index.js";
import Constants from "../../constants/index.js";
import QuantityReportController from './QuantityReportController.js';
import ManpowerReportController from "./ManpowerReportController.js";
import { ObjectId } from "mongodb";


const ReportController = {

    async saveReport(req, res, next){

        // const {error} = reportSchema.validate(req.body);
        // if(error){
        //     return next(error);
        // }

        // const company = {
        //     _id
        // }
        // req.company = company;
        // next()

        // console.log(req.body);
        // return;

        try {
            let current_date = CustomFunction.currentDate();
            let current_time = CustomFunction.currentTime();
            // let sta_date = "2022/08/23"
            const {company_id, project_id, user_id} = req.body;
            const exist = await Report.exists({company_id:company_id, project_id:project_id, user_id:user_id, report_date:current_date});
            let report_id ;
           
            if (!exist) {
                const report = new Report({
                    company_id:company_id,
                    project_id:project_id,
                    user_id:user_id,
                    report_date:current_date,
                    report_time:current_time,
                }) ;
                const result = await report.save();
                report_id = result._id;
            }else{
                report_id = exist._id;
            }
            let bodyData;
            switch (req.params.type) {
                case Constants.MANPOWER:
                    const {contractor_id,manpowerCategories} = req.body;
                    bodyData = {
                        report_id:report_id,
                        user_id:user_id,
                        contractor_id:contractor_id,
                        manpowerCategories:manpowerCategories,
                    }
                    ManpowerReportController.store(bodyData).then((result)=>{
                        if (result.status === Constants.RES_SUCCESS) {
                            res.send(CustomSuccessHandler.success('Manpower report created successfully'))
                        }else{
                            return (result.error);
                        }
                    });
                    break;
                case Constants.STOCK:
                    console.log("Stock")
                    break;
                case Constants.QUANTITY:
                    const {inputs} = req.body;
                    bodyData = {
                        report_id:report_id,
                        user_id:user_id,
                        inputs:inputs,
                    }
                    
                    QuantityReportController.store(bodyData).then((result, err)=>{
                        if (result.status === Constants.RES_SUCCESS) {
                            res.send(CustomSuccessHandler.success('Quantity item report created successfully'))
                        }else{
                            return (err);
                        }
                    });
                    break;
                case Constants.TANDP:
                    console.log("TAndP")
                    break;

                default:
                    console.log("Nothing to match")
                    break;
            }

            // use another controller function here
        } catch (err) {
            return next(err);
        }

        
        

        // try {
        //     // res.status(200).send({ "status": "success", "message": "Project created" })
        //     res.send(CustomSuccessHandler.success('Report created successfully'));
        // } catch (err) {
        //     return next(err);
        // }

        // const data = QuantityReportController.index(); //final call
        // console.log(data);
    },

    async index(req, res, next){
        let documents
        try {
            
            documents = await Report.aggregate([
                {
                    $match: {
                        // $and: [
                        //     { "project_id": ObjectId(req.params.project_id) },
                        // ]
                        "project_id": ObjectId(req.params.project_id),
                        // "user_id": ObjectId(req.params.user_id),
                        // "report_date": req.params.date
                    }
                    
                },
                {
                    $lookup: { 
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'userData'
                    }
                },
                {$unwind:"$userData"},
                // {
                //     $lookup: { 
                //         from: 'manpowerReports',
                //         localField: '_id',
                //         foreignField: 'report_id',
                //         as: 'manpowerReportData'
                //     }
                // },
                // {$unwind:"$manpowerReportData"},
                // {
                //     $lookup: {
                //         from: "contractors",
                //         localField: "manpowerReportData.contractor_id",
                //         foreignField: "_id",
                //         as: 'contractorData'
                //     }
                // },
                // {$unwind:"$contractorData"},
                // {
                //     $lookup: {
                //         from: "manpowerMemberReports",
                //         let: { "manpower_report_id": "$manpowerReportData._id" },
                //         pipeline: [
                //             {
                //                 $match: {
                //                     $expr: { $eq: ["$manpower_report_id", "$$manpower_report_id"] }
                //                 }
                //             },
                //         ],
                //         as: 'manpowerMemberReportData'
                //     }
                // },
                // {$unwind: "$manpowerMemberReportData"},
                // {
                //     $group:{
                //         _id: "$manpowerMemberReportData.manpower_report_id" ,
                //         "company_id": { "$first": "$company_id" },
                //         "project_id": { "$first": "$project_id" },
                //         "user_id": { "$first": "$manpowerReportData.user_id" },
                //         "user_name": { "$first": "$userData.name" },
                //         "contractor_id": { "$first": "$manpowerReportData.contractor_id" },
                //         "contractor_name": { "$first": "$contractorData.contractor_name" },
                //         "manpower_category_id_new": { $addToSet : "$manpowerMemberReportData.manpower_category_id" },
                //         "manpowerCategories":{"$push":'$manpowerMemberReportData'}
                //     }
                // },
                {
                    $project: {
                        _id: 1, 
                        company_id: 1,     
                        project_id: 1,
                        user_id: "$user_id",
                        user_name: "$userData.name",
                        report_date: 1,
                        report_time: 1,
                        // contractor_id: "$contractor_id",
                        // contractor_name: "$contractor_name",
                        // manpowerReport:[{
                        //     manpower_category_id: "$manpower_category_id_new",
                        //     members:"$manpowerCategories"
                        // }]
                    }
                },
            ]);
        } catch (err) {
            return next(err);
        }
        return res.json({ "status": 200, data:documents });

    },

}

export default ReportController;