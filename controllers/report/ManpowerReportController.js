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
                // {
                //     $match: { 
                //         // "project_id": ObjectId("62c827ad9c1d4cb814eaddfa")
                //         "project_id": ObjectId(req.params.project_id)
                //     }
                // },
                // {
                //     $lookup: { 
                //         from: 'manpowerReports',
                //         localField: '_id',
                //         foreignField: 'report_id',
                //         let: { "user_id": ObjectId(req.params.user_id) },
                //         let: { "manpower_report_date":req.params.date },
                //         pipeline: [
                //             {
                //                 $match: {
                //                     $expr: { $eq: ["$user_id", "$$user_id"] },
                //                     $expr: { $eq: ["$manpower_report_date", "$$manpower_report_date"] }
                //                 }
                //             }
                //         ],
                //         as: 'manpowerReportData'
                //     },
                // },
                {
                    $lookup: { 
                        from: 'projectTeam',
                        localField: 'project_id',
                        foreignField: 'project_id',
                        as: 'projectCountData'
                    }
                },
                  { $addFields: {projectTeamCount: {$size: "$projectCountData"}}},
                {
                    $match: { 
                        "project_id": ObjectId(req.params.project_id),
                        "user_id": ObjectId(req.params.user_id),
                        "report_date": req.params.date
                    }
                },
                {
                    $lookup: { 
                        from: 'manpowerReports',
                        localField: '_id',
                        foreignField: 'report_id',
                        as: 'manpowerReportData'
                    }
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
                    $lookup:{
                          from:"manpowerCategories",
                          localField: "manpowerMemberReportData.manpower_category_id",
                          foreignField: "_id",
                          as: 'manpowerCategoryData'
                      }
                },
                {$unwind: "$manpowerCategoryData"},
                {
                    $group:{
                        _id: "$manpowerMemberReportData.manpower_report_id" ,
                        "main_report_id": { "$first": "$_id" },
                        "project_team_count":{ "$first": "$projectTeamCount"},
                        "company_id": { "$first": "$company_id" },
                        "project_id": { "$first": "$project_id" },
                        "user_id": { "$first": "$manpowerReportData.user_id" },
                        "manpower_count": { $sum: "$manpowerMemberReportData.manpower_member" },
                        "contractor_id": { "$first": "$manpowerReportData.contractor_id" },
                        "contractor_name": { "$first": "$contractorData.contractor_name" },
                        // "manpower_category_id_new": { $addToSet : "$manpowerMemberReportData.manpower_category_id" },
                        // "manpowerCategories":{"$push":'$manpowerMemberReportData'}

                        "manpowerCategories":{
                            "$push":{
                                _id:'$manpowerMemberReportData._id', 
                                manpower_report_id:'$manpowerMemberReportData.manpower_report_id',
                                manpower_category_id:'$manpowerMemberReportData.manpower_category_id',
                                manpower_category_name:'$manpowerCategoryData.manpower_category',
                                manpower_member:'$manpowerMemberReportData.manpower_member',
                                
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,                         
                        report_id:"$main_report_id",     
                        user_id: "$user_id",
                        manpower_count:"$manpower_count",
                        project_Team_count:"$project_team_count",
                        contractor_id: "$contractor_id",
                        contractor_name: "$contractor_name",
                        manpower_report_date: 1,
                        manpower_report_time: 1,
                        manpowerCategories:"$manpowerCategories"
                    }
                },
                
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
                //         "contractor_id": { "$first": "$manpowerReportData.contractor_id" },
                //         "contractor_name": { "$first": "$contractorData.contractor_name" },
                //         "manpower_category_id_new": { $addToSet : "$manpowerMemberReportData.manpower_category_id" },
                //         "manpowerCategories":{"$push":'$manpowerMemberReportData'}
                //     }
                // },

                // {
                //     $project: {
                //         _id: 1, 
                //         company_id: 1,     
                //         project_id: 1,
                //         user_id: "$user_id",
                //         contractor_id: "$contractor_id",
                //         contractor_name: "$contractor_name",
                //         manpowerCategories:[{
                //             manpower_category_id: "$manpower_category_id_new",
                //             members:"$manpowerCategories"
                //         }]
                //     }
                // },

            ]);
        } catch (err) {
            return next(err);
        }
        
        return res.json({ "status": 200, data:documents });
    },

    // db.reports.aggregate(
    //     {
    //         $match: { 
    //             "project_id": ObjectId("62c827ad9c1d4cb814eaddfa")
    //             // "project_id": ObjectId(req.params.project_id)
    //         }
    //     },
    //     {
    //         $lookup: { 
    //             from: 'manpowerReports',
    //             localField: '_id',
    //             foreignField: 'report_id',
    //             let: { "user_id": ObjectId("62c827e09c1d4cb814eae193") },
    //             let: { "manpower_report_date":"2022/08/18" },
    //             pipeline: [
    //                 {
    //                     $match: {
    //                         $expr: { $eq: ["$user_id", "$$user_id"] },
    //                         $expr: { $eq: ["$manpower_report_date", "$$manpower_report_date"] }
    //                     }
    //                 }
    //             ],
    //             as: 'manpowerReportData'
    //         },
    //     },
    //     {$unwind:"$manpowerReportData"},
    //     {
    //         $lookup: {
    //             from: "contractors",
    //             localField: "manpowerReportData.contractor_id",
    //             foreignField: "_id",
    //             as: 'contractorData'
    //         }
    //     },
    //     {$unwind:"$contractorData"},
        
    //     //--------------- not required ------------
    //     // {
    //     //     $lookup: {
    //     //         from: "manpowerCategories",
    //     //         localField: "manpowerReportData.manpower_category_id",
    //     //         foreignField: "_id",
    //     //         as: 'manpowerCategoryData'
    //     //     }
    //     // },
    //     // {$unwind:"$manpowerCategoryData"},
    //     //--------------- not required ------------
    
    //     {
    //         $lookup: {
    //             from: "manpowerMemberReports",
    //             let: { "manpower_report_id": "$manpowerReportData._id" },
    //             pipeline: [
    //                 {
    //                     $match: {
    //                         $expr: { $eq: ["$manpower_report_id", "$$manpower_report_id"] }
    //                     }
    //                 },
    //             ],
    //             as: 'manpowerMemberReportData'
    //         }
    //     },
    //     // {$unwind: "$manpowerMemberReportData"},
    //     // {
    //     //     $lookup: {
    //     //         from: "manpowerSubCategories",
    //     //         localField: "manpowerMemberReportData.manpower_sub_category_id",
    //     //         foreignField: "_id",
    //     //         as: 'manpowerSubCategoryData'
    //     //     }
    //     // },
    //     // {$unwind:"$manpowerSubCategoryData"},
    //     {
    //           $group:{
    //               _id:'$manpowerReportData.contractor_id', 
    //               "company_id": { "$first": "$company_id" },
    //               "project_id": { "$first": "$project_id" },
    //               manpower_category_id:{
    //                 $push:'$manpowerReportData.manpower_category_id'
    //               },
    //               members:{
    //                 $push:'$manpowerMemberReportData.manpower_sub_category_id'
    //               },
    //           }
    //     },       
              
    //     //   {
    //     //     $project: {
    //     //         _id: 1, 
    //     //         company_id: 1,     
    //     //         project_id: 1,
    //     //         user_id: "$manpowerReportData.user_id",
    //     //         // contractor_id: "$manpowerReportData.contractor_id",
    //     //         contractor_id: "$_id",
    //     //         contractor_name: "$contractorData.contractor_name",
    //     //         // manpowerCategories:{
    //     //         //     // manpower_category_id:"$manpowerReportData.manpower_category_id",
    //     //         // }
    //     //         manpowerCategories:"$manpower_category_id",
    //     //         // member:"$manpowerMemberReportData.manpower_sub_category_id"
    //     //     }
    //     // },
    //   );

    
    async store(req, res, next){
        const {report_id, user_id, contractor_id, manpowerCategories} = req;
        let current_date = CustomFunction.currentDate();
        let current_time = CustomFunction.currentTime();
        //-----------------
        let manpower_report_id
        const exist = await ManpowerReport.exists({report_id: ObjectId(report_id), user_id: ObjectId(user_id), contractor_id: ObjectId(contractor_id), manpower_report_date: current_date});
        if (!exist) {
            const manpower_report = new ManpowerReport({
                report_id,
                user_id,
                contractor_id,
                manpower_report_date:current_date,
                manpower_report_time:current_time
            });
            const result = await manpower_report.save();
            manpower_report_id = result._id;
        }else{
            manpower_report_id = exist._id;
        }
        let manpower_reports_exist;
        try {
            manpowerCategories.forEach( async (list, key) => {
                manpower_reports_exist = await ManpowerMemberReport.exists({ manpower_report_id: ObjectId(manpower_report_id), manpower_category_id: ObjectId(list.manpower_category_id)  } );  
                if (manpower_reports_exist) {
                    return ;
                }

                if (list.manpower_member) {
                    const manpower_member_report = new ManpowerMemberReport({
                        manpower_report_id: ObjectId(manpower_report_id),
                        manpower_category_id: ObjectId(list.manpower_category_id),
                        manpower_member : list.manpower_member,
                    });
                    const member_result = await manpower_member_report.save();
                }


                // list.members.forEach( async (member_list, key) => {
                //     manpower_reports_exist = await ManpowerMemberReport.exists({ manpower_report_id: ObjectId(manpower_report_id), manpower_sub_category_id: ObjectId(member_list.manpower_sub_category_id)  } ); 
                        
                //     if (manpower_reports_exist) {
                //         return ;
                //     }

                //     const manpower_member_report = new ManpowerMemberReport({
                //         manpower_report_id: ObjectId(manpower_report_id),
                //         manpower_category_id: ObjectId(list.manpower_category_id),
                //         manpower_sub_category_id : ObjectId(member_list.manpower_sub_category_id),
                //         manpower_member : member_list.manpower_member,
                //     });
                //     const member_result = await manpower_member_report.save();
                // });

            });
        } catch (error) {
            return ({status:400, error:"Something went wrong"});
        }

        //---------------------------------------------
        // try {
        //     manpowerCategories.forEach( async (list, key) => {
        //         const report_exist = await ManpowerMemberReport.exists({manpower_report_id: ObjectId(manpower_report_id), manpower_category_id: ObjectId(list.manpower_category_id)});
        //         if (report_exist) {
        //             return ;
        //         }
        //         list.members.forEach( async (member_list, key) => {
        //             const manpower_member_report = new ManpowerMemberReport({
        //                 manpower_category_id: ObjectId(list.manpower_category_id),
        //                 manpower_report_id:ObjectId(manpower_report_id),
        //                 manpower_sub_category_id : ObjectId(member_list.manpower_sub_category_id),
        //                 manpower_member : member_list.manpower_member,
        //             });
        //             const member_result = await manpower_member_report.save();
        //         });
        //     });
            
        // } catch (err) {
        //     return ({status:400, error:"Something went wrong"});
        // }
        //---------------------

        return ({ status:200 });
    },

    async edit(req, res, next){
        let document;
        try {
            await ManpowerReport.aggregate([
                {
                    $match: { 
                        "contractor_id": ObjectId(req.params.contractor_id),
                        "manpower_report_date": req.params.date
                        // "user_id": ObjectId("62c827e09c1d4cb814eae193"),
                        // "company_id": ObjectId("62ba94b8ea988119bbf13687")
                    }
                },
                {
                    $lookup: {
                        from: "manpowerMemberReports",
                        let: { "manpower_report_id": "$_id" },
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
                    $lookup:{
                          from:"manpowerCategories",
                          localField: "manpowerMemberReportData.manpower_category_id",
                          foreignField: "_id",
                          as: 'manpowerCategoryData'
                      }
                },
                {$unwind: "$manpowerCategoryData"},
                {
                    $group:{
                        _id: "$manpowerMemberReportData.manpower_report_id" ,
                        "report_id": { "$first": "$report_id" },
                        "user_id": { "$first": "$user_id" },
                        "contractor_id": { "$first": "$contractor_id" },
                        // "manpower_category_id_new": { $addToSet : "$manpowerMemberReportData.manpower_category_id" },
                        // "manpowerCategories":{"$push":'$manpowerMemberReportData'}
                          "manpowerCategories":{"$push":{
                              _id:'$manpowerMemberReportData._id', 
                              manpower_report_id:'$manpowerMemberReportData.manpower_report_id',
                              manpower_category_id:'$manpowerMemberReportData.manpower_category_id',
                              manpower_category_name:'$manpowerCategoryData.manpower_category',
                              manpower_member:'$manpowerMemberReportData.manpower_member',
                          }
                      }}
                },
                {
                    $project: {
                        _id: 1, 
                        report_id: "$report_id",  
                        user_id: "$user_id",
                        contractor_id: "$contractor_id",
                        manpowerCategories:"$manpowerCategories"
                    }
                }
                
                
            ]).then(function([res]) {
                document = res
            });

        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        return res.json({"status":200, data:document});
    },

    async update(req, res, next){
        const {manpowerCategories} = req.body;
        const manpower_report_id = req.params.manpower_report_id;
        try {
            manpowerCategories.forEach( async (list) => {

                if (list.manpower_member) {
                    const document_exist = await ManpowerMemberReport.exists({manpower_report_id: ObjectId(manpower_report_id), manpower_category_id:ObjectId(list.manpower_category_id)});
                    if (document_exist) {
                        const document = await ManpowerMemberReport.findByIdAndUpdate(
                            { _id: document_exist._id},
                            {manpower_member:list.manpower_member},
                            {new: true}
                        );
                        return ;
                    }

                    const manpower_member_report = new ManpowerMemberReport({
                        manpower_report_id: ObjectId(manpower_report_id),
                        manpower_category_id: ObjectId(list.manpower_category_id),
                        manpower_member : list.manpower_member,
                    });
                    const member_result = await manpower_member_report.save();
                }
            });
        } catch (err) {
            return next(err);
        }
        
        return res.send(CustomSuccessHandler.success("Manpower report updated successfully"));
    },

    async manpowerReportByReportId(req, res, next){
        let documents;
        
        try {
            documents = await ManpowerReport.aggregate([
                {
                    $match: { 
                        "report_id": ObjectId(req.params.report_id),
                    }
                },
                {
                    $lookup: {
                        from: "contractors",
                        localField: "contractor_id",
                        foreignField: "_id",
                        as: 'contractorData'
                    }
                },
                {$unwind:"$contractorData"},
                {
                    $lookup: {
                        from: "manpowerMemberReports",
                        let: { "manpower_report_id": "$_id" },
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
                    $lookup:{
                        from:"manpowerCategories",
                        localField: "manpowerMemberReportData.manpower_category_id",
                        foreignField: "_id",
                        as: 'manpowerCategoryData'
                    }
                },
                {$unwind: "$manpowerCategoryData"},
                {
                    $group:{
                        _id: "$manpowerMemberReportData.manpower_report_id" ,
                        "user_id": { "$first": "$user_id" },
                        "contractor_id": { "$first": "$contractor_id" },
                        "contractor_name": { "$first": "$contractorData.contractor_name" },
                        "total_manpower": { $sum: "$manpowerMemberReportData.manpower_member" },  
                                           
                        // "manpower_category_id_new": { $addToSet : "$manpowerMemberReportData.manpower_member" },//not use
                        "manpowerCategories":{
                            "$push":{
                                _id:'$manpowerMemberReportData._id', 
                                manpower_report_id:'$manpowerMemberReportData.manpower_report_id',
                                manpower_category_id:'$manpowerMemberReportData.manpower_category_id',
                                manpower_category_name:'$manpowerCategoryData.manpower_category',
                                manpower_sub_category_id:'$manpowerMemberReportData.manpower_sub_category_id',
                                manpower_member:'$manpowerMemberReportData.manpower_member',
                            }, 
                        }
                    }
                },
                
                {
                    $project: {
                        _id: 1, 
                        report_id: 1,     
                        user_id: "$user_id",
                        contractor_id: "$contractor_id",
                        contractor_name: "$contractor_name",
                        manpower_report_date: 1,
                        manpower_report_time: 1,
                        manpowerCategories:"$manpowerCategories",
                        total_manpower:"$total_manpower",
                        // grand_total_manpower:{$sum: "$manpowerCategories.manpower_member"},
                    }
                },

                    // {
                    //     $match: { 
                    //         "report_id": ObjectId("63061a658916a01275588652"),
                    //     }
                    // },
                    // {
                    //     $lookup: {
                    //         from: "contractors",
                    //         localField: "contractor_id",
                    //         foreignField: "_id",
                    //         as: 'contractorData'
                    //     }
                    // },
                    // {$unwind:"$contractorData"},
                    // {
                    //     $lookup: {
                    //         from: "manpowerMemberReports",
                    //         let: { "manpower_report_id": "$_id" },
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
                    //                 $lookup:{
                    //                           from:"manpowerCategories",
                    //                           let: { "manpower_category_id": "$manpowerMemberReportData.manpower_category_id".toString()},
                    //                           pipeline: [
                    //                                       {
                    //                                         $match: {
                    //                                             $expr: { $eq: ["$_id", "$$manpower_category_id"] }
                    //                                                 }
                    //                                       },
                    //                                   ],
                    //                           as: 'manpowerCateg'
                                    
                    //                            }
                    // },
                    // {$unwind: "$manpowerCateg"},
                    // {
                    //      $lookup:{ 
                    //                from:"manpowerSubCategories",
                    //                let:{"manpower_sub_category_id":"$manpowerMemberReportData.manpower_sub_category_id".toString()},
                    //                pipeline:[
                    //                           {
                    //                             $match:{
                    //                               $expr:{$eq:["$_id","$$manpower_sub_category_id"]}
                    //                             }    
                    //                           }
                    //                         ],
                    //                 as:"manpowerSubCateg"
                    //              }
                    // },
                    // {$unwind:"$manpowerSubCateg"},
                    // {
                    //       $group:{
                    //           _id: "$manpowerMemberReportData.manpower_report_id" ,
                    //           "report_id": { "$first": "$report_id" },
                    //           "contractor_id": { "$first": "$manpowerReportData.contractor_id" },
                    //           "contractor_name": { "$first": "$contractorData.contractor_name" },
                    //           "manpower_category_id_new": { $addToSet : "$manpowerMemberReportData.manpower_category_id" },
                    //           "manpowerCategories":{$addToSet:'$manpowerMemberReportData'},
                    //           "manpowers": { "$push": { manpower_category: "$manpowerCateg.manpower_category",
                    //                                 manpower_sub_category: "$manpowerSubCateg.manpower_sub_category" } }
                    //       }
                    //   },
                
                  
                    //   {
                    //       $project: {
                    //           _id: "$_id",
                    //           report_id:"$report_id",
                    //           contractor_id: "$contractor_id",
                    //           contractor_name: "$contractor_name",
                    //           manpowerCategories:[{
                    //               manpower_category_id: "$manpower_category_id_new",
                    //               members:"$manpowerCategories",
                    //               manpowers:"$manpowers"
                    //           }],
                                  
                
                    //       }
                    //   },
                //-------------------------------------
                    // {
                    //     $match: { 
                    //         "report_id": ObjectId("63061a658916a01275588652"),
                    //     }
                    // },
                    // {
                    //     $lookup: {
                    //         from: "contractors",
                    //         localField: "contractor_id",
                    //         foreignField: "_id",
                    //         as: 'contractorData'
                    //     }
                    // },
                    // {$unwind:"$contractorData"},
                    // {
                    //     $lookup: {
                    //         from: "manpowerMemberReports",
                    //         let: { "manpower_report_id": "$_id" },
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
                    //                 $lookup:{
                    //                           from:"manpowerCategories",
                    //                           let: { "manpower_category_id": "$manpowerMemberReportData.manpower_category_id".toString()},
                    //                           pipeline: [
                    //                                       {
                    //                                         $match: {
                    //                                             $expr: { $eq: ["$_id", "$$manpower_category_id"] }
                    //                                                 }
                    //                                       },
                    //                                   ],
                    //                           as: 'manpowerCateg'
                                    
                    //                            }
                    // },
                    // {$unwind: "$manpowerCateg"},
                    // {
                    //      $lookup:{ 
                    //                from:"manpowerSubCategories",
                    //                let:{"manpower_sub_category_id":"$manpowerMemberReportData.manpower_sub_category_id".toString()},
                    //                pipeline:[
                    //                           {
                    //                             $match:{
                    //                               $expr:{$eq:["$_id","$$manpower_sub_category_id"]}
                    //                             }    
                    //                           }
                    //                         ],
                    //                 as:"manpowerSubCateg"
                    //              }
                    // },
                    // {$unwind:"$manpowerSubCateg"},
                    // {
                    //       $group:{
                    //           _id: "$manpowerMemberReportData.manpower_report_id" ,
                    //           "report_id": { "$first": "$report_id" },
                    //           "contractor_id": { "$first": "$contractor_id" },
                    //           "contractor_name": { "$first": "$contractorData.contractor_name" },
                    //           "manpower_category_id_new": { $addToSet : "$manpowerMemberReportData.manpower_category_id" },
                    //           "manpowerCategories":{$addToSet:'$manpowerMemberReportData'},
                    //           "manpowers": { "$push": { manpower_category: "$manpowerCateg.manpower_category",
                    //                                 manpower_sub_category: "$manpowerSubCateg.manpower_sub_category",
                    //                                 manpower_category_id:"$manpowerCateg._id",
                    //                                 manpower_sub_category_id:"$manpowerSubCateg._id"
                    //           } },
                    //       }
                    //   },
                
                  
                    //   {
                    //       $project: {
                    //           _id: "$_id",
                    //           report_id:"$report_id",
                    //           contractor_id: "$contractor_id",
                    //           contractor_name: "$contractor_name",
                    //           manpowerCategories:[{
                    //               manpower_category_id: "$manpower_category_id_new",
                    //                 "members": {
                    //                   "$map": {
                    //                     "input": "$manpowerCategories",
                    //                     "in": {
                    //                       "$let": {
                    //                         "vars": {
                    //                           "m": {
                    //                             "$arrayElemAt": [
                    //                               {
                    //                                 "$filter": {
                    //                                   "input": "$manpowers",
                    //                                   "cond": {
                    //                                     "$eq": [
                    //                                       "$$mb.manpower_category_id",
                    //                                       "$$this.manpower_category_id"
                    //                                     ]
                    //                                   },
                    //                                   "as": "mb"
                    //                                 }
                    //                               },
                    //                               0
                    //                             ]
                    //                           }
                    //                         },
                    //                         "in": {
                    //                           "$mergeObjects": [
                    //                             "$$this",
                    //                             {
                    //                               "manpower_category": "$$m.manpower_category",
                    //                               "manpower_sub_category":"$$m.manpower_sub_category"
                    //                             }
                    //                           ]
                    //                         }
                    //                       }
                    //                     }
                    //                   }
                    //                 }
                    //           }],
                    //       }
                    //   }

            ]);

        } catch (err) {
            return next(err);
        }
        
        return res.json({ "status": 200, data:documents });
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



// db.reports.aggregate(
//     {
//                       $match: { 
//                           "project_id": ObjectId("62c827499c1d4cb814ead624")
//                           // "project_id": ObjectId(req.params.project_id)
//                       }
//                   },
//                   {
//                       $lookup: { 
//                           from: 'manpowerReports',
//                           localField: '_id',
//                           foreignField: 'report_id',
//                           let: { "user_id": ObjectId("62c827e09c1d4cb814eae193") },
//                           let: { "manpower_report_date":"2022/08/21" },
//                           pipeline: [
//                               {
//                                   $match: {
//                                       $expr: { $eq: ["$user_id", "$$user_id"] },
//                                       $expr: { $eq: ["$manpower_report_date", "$$manpower_report_date"] }
//                                   }
//                               }
//                           ],
//                           as: 'manpowerReportData'
//                       },
//                   },
//                   {$unwind:"$manpowerReportData"},
//                   {
//                       $lookup: {
//                           from: "contractors",
//                           localField: "manpowerReportData.contractor_id",
//                           foreignField: "_id",
//                           as: 'contractorData'
//                       }
//                   },
//                   {$unwind:"$contractorData"},
//                   {
//                       $lookup: {
//                           from: "manpowerMemberReports",
//                           let: { "manpower_report_id": "$manpowerReportData._id" },
//                           pipeline: [
//                               {
//                                   $match: {
//                                       $expr: { $eq: ["$manpower_report_id", "$$manpower_report_id"] }
//                                   }
//                               },
//                           ],
//                           as: 'manpowerMemberReportData'
//                       }
//                   },
//                   {$unwind: "$manpowerMemberReportData"},
//                   {
//                     $group:
//                       {
//                         _id: "$manpowerMemberReportData.manpower_report_id" ,
//                         "company_id": { "$first": "$company_id" },
//                         "project_id": { "$first": "$project_id" },
//                         "user_id": { "$first": "$manpowerReportData.user_id" },
//                         "contractor_id": { "$first": "$manpowerReportData.contractor_id" },
//                         "contractor_name": { "$first": "$contractorData.contractor_name" },
//                         // "manpower_category_id": { "$first": "$manpowerMemberReportData.manpower_category_id" },
//                         "manpower_category_id_new": { $addToSet : "$manpowerMemberReportData.manpower_category_id" },
//                         "manpowerCategories":{"$push":'$manpowerMemberReportData'}
//                       }
//                   },
                  
//                   {
//                       $project: {
//                           _id: 1, 
//                           company_id: 1,     
//                           project_id: 1,
//                           user_id: "$user_id",
//                           contractor_id: "$contractor_id",
//                           contractor_name: "$contractor_name",
//                           // manpower_category_id: "$manpower_category_id",
//                           manpowerCategories:[{ 
//                             // $unwind: "$manpower_category_id_new",
                           
//                             $manpower_category_id_new.map(ele=>
//                             manpowerCategories.push(ele)
//                             ),
//                             members:"$manpowerCategories"
//                             }]
                            
                          
  
//                       }
//                   },
//     );