import {Report, ManpowerReport, ManpowerMemberReport } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import CustomFunction from "../../services/CustomFunction.js";
import { ObjectId } from "mongodb";

const ManpowerReportController = {

    async index(req, res, next){
        let documents;
        try {
            documents = await Report.aggregate([
                {
                    $match: { 
                        // "project_id": ObjectId("62c827499c1d4cb814ead624")
                        "project_id": ObjectId(req.params.project_id)
                    }
                },
                {
                    $lookup: { 
                        from: 'manpowerReports',
                        localField: '_id',
                        foreignField: 'report_id',
                        let: { "user_id": ObjectId("62c827689c1d4cb814ead866") },
                        let: { "manpower_report_date":"2022/08/17" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$user_id", "$$user_id"] },
                                    $expr: { $eq: ["$manpower_report_date", "$$manpower_report_date"] }
                                }
                            }
                        ],
                        as: 'manpowerReportData'
                    },
                },
                {$unwind:"$manpowerReportData"},
                {
                    $lookup: {
                        from: "contractors",
                        localField: "manpowerReportData.contractor_id",
                        foreignField: "_id",
                        as: 'contractorData'
                    }
                },
                {$unwind:"$contractorData"},
                {
                    $lookup: {
                        from: "manpowerCategories",
                        localField: "manpowerReportData.manpower_category_id",
                        foreignField: "_id",
                        as: 'manpowerCategoryData'
                    }
                },
                {$unwind:"$manpowerCategoryData"},
                {
                    $lookup: {
                        from: "manpowerMemberReports",
                        let: { "manpower_report_id": "$manpowerReportData._id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$manpower_report_id", "$$manpower_report_id"] }
                                }
                            },
                        ],
                        as: 'manpowerMemberReportData'
                    }
                },
                {$unwind: "$manpowerMemberReportData"},
                {
                    $lookup: {
                        from: "manpowerSubCategories",
                        localField: "manpowerMemberReportData.manpower_sub_category_id",
                        foreignField: "_id",
                        as: 'manpowerSubCategoryData'
                    }
                },
                {$unwind:"$manpowerSubCategoryData"},
              
                {
                    $project: {
                        _id: 1, 
                        company_id: 1,     
                        project_id: 1,
                        user_id: "$manpowerReportData.user_id",
                        contractor_id: "$manpowerReportData.contractor_id",
                        contractor_name: "$contractorData.contractor_name",
                    }
                },
    
            ]);
        } catch (err) {
            return next(err);
        }
        
        return res.json({ "status": 200, data:documents });
    },

    async store(req, res, next){
        const {report_id, user_id, contractor_id, manpowerCategories} = req;
        let current_date = CustomFunction.currentDate();
        let current_time = CustomFunction.currentTime();
        let manpower_report_id
        try {
            console.log(manpowerCategories);
            manpowerCategories.forEach( async (list, key) => {
                console.log(manpowerCategories);
                console.log("object")
                console.log(list.manpower_category_id);


                // const report_exist = await ManpowerReport.exists({report_id: ObjectId(report_id), contractor_id: ObjectId(contractor_id), manpower_category_id: ObjectId(list.manpower_category_id),manpower_report_date: current_date});
                // if (report_exist) {
                //     return ;
                // }

                // const manpower_report = new ManpowerReport({
                //     report_id,
                //     user_id,
                //     contractor_id,
                //     manpower_category_id:list.manpower_category_id,
                //     manpower_report_date:current_date,
                //     manpower_report_time:current_time
                // });
                // const result = await manpower_report.save();
                // manpower_report_id = result._id;

                // list.members.forEach( async (member_list, key) => {
                //     const manpower_member_report = new ManpowerMemberReport({
                //         manpower_report_id:ObjectId(manpower_report_id),
                //         manpower_sub_category_id : ObjectId(member_list.manpower_sub_category_id),
                //         manpower_member : member_list.manpower_member,
                //     });
                //     const member_result = await manpower_member_report.save();
                // });

            });
        } catch (err) {
            return ({status:400, error:"Something went wrong"});
        }

        return ({ status:200 });
    },


    // async store(req, res, next){
    //     const {report_id, user_id, contractor_id, manpower_category_id, members} = req;
    //     let current_date = CustomFunction.currentDate();
    //     let current_time = CustomFunction.currentTime();
    
    //     const report_exist = await ManpowerReport.exists({report_id: ObjectId(report_id), contractor_id: ObjectId(contractor_id),manpower_category_id: ObjectId(manpower_category_id),quantity_report_date: current_date});
    //     let manpower_report_id
    //     try {
    //         if (!report_exist) {
    //             const manpower_report = new ManpowerReport({
    //                 report_id,
    //                 user_id,
    //                 contractor_id,
    //                 manpower_category_id,
    //                 manpower_report_date:current_date,
    //                 manpower_report_time:current_time
    //             });
    //             const result = await manpower_report.save();
    //             manpower_report_id = result._id;
    //         }else{
    //             manpower_report_id = report_exist._id;
    //         }
    //     } catch (err) {
    //         return next(err);
    //     }
    //     let manpower_reports_exist;
        
    //     try {
    //         members.forEach( async (list, key) => {
    //             // manpower_reports_exist = await ManpowerMemberReport.exists({manpower_report_id: ObjectId(manpower_report_id), manpower_sub_category_id:list.manpower_sub_category_id });
    //             manpower_reports_exist =  ManpowerMemberReport.find({
    //                 $and: [
    //                     { manpower_report_id: { $eq: ObjectId(manpower_report_id) }, manpower_sub_category_id: { $eq: ObjectId(list.manpower_sub_category_id) } } 
    //                 ]
    //             })
    //             if (manpower_reports_exist) {
    //                 return ;
    //             }
    //             const manpower_member_report = new ManpowerMemberReport({
    //                 manpower_report_id:ObjectId(manpower_report_id),

    //                 manpower_sub_category_id : ObjectId(list.manpower_sub_category_id),
    //                 manpower_member : list.manpower_member,
    //             });
    //             const member_result = await manpower_member_report.save();
    //         });
    //         return ({ status:200 });
    //     } catch (err) {
    //         return ({status:400, error:"Something went wrong"});
    //     }
    // }

}

export default ManpowerReportController;