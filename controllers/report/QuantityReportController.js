import { QuantityReport, QuantityWorkItemReport, Report } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import CustomFunction from "../../services/CustomFunction.js";

import { ObjectId } from "mongodb";

const QuantityReportController = {

    async index(req, res, next) {

        let documents;
        try {
        const { company_id, project_id, inputs } = req.body;
        documents = await Report.aggregate([
            {
                $match: {
                    // $and: [
                    //     { "project_id": ObjectId(req.params.project_id) },
                    // ]
                    "project_id": ObjectId(req.params.project_id),
                    "user_id": ObjectId(req.params.user_id),
                    "report_date": req.params.date
                }

            },
            // {
            //     $lookup: { 
            //         from: 'quantityReports',
            //         localField: '_id',
            //         foreignField: 'report_id',
            //         let: { "user_id": ObjectId(req.params.user_id) },
            //         // let: { "quantity_report_date": "2022/08/06" },
            //         let: { "quantity_report_date": req.params.user_date },
            //         pipeline: [
            //             {
            //                 $match: {
            //                     $expr: { $eq: ["$user_id", "$$user_id"] },
            //                     $expr: { $eq: ["$quantity_report_date", "$$quantity_report_date"] }
            //                 }
            //             }
            //         ],
            //         as: 'quantityReport'
            //     },
            // },
            {
                $lookup: { 
                      from: 'quantityReports',
                      localField: '_id',
                      foreignField: 'report_id',
                      as: 'quantityReport'
                    }
                },

            {
                $unwind: "$quantityReport"
            },

            {
                $lookup: {
                    from: "quantityWorkItemReports",
                    let: { "quantity_report_id": "$quantityReport._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$quantity_report_id", "$$quantity_report_id"] }
                            }
                        },
                    ],
                    as: 'quantityWorkItems'
                }
            },
            {
                $unwind: "$quantityWorkItems"
            },
            {
                $lookup: {
                    from: "quantityReportItems",
                    localField: "quantityWorkItems.item_id",
                    foreignField: "_id",
                    as: 'itemsName'
                }
            },
            {
                $unwind: "$itemsName"
            },
            {
                $project: {
                    _id: 1, 
                    company_id: 1,     
                    project_id: 1,
                    quantityReport: {
                        _id: 1,
                        user_id: 1,
                        report_id: 1,
                        quantity_report_date: 1,
                        quantity_report_time: 1,
                    },
                    quantityWorkItems: {
                        _id: 1,
                        quantity_report_id: 1,
                        item_id: 1,
                        item_name: "$itemsName.item_name",
                        unit_name: 1,
                        num_length: 1,
                        num_width: 1,
                        num_height: 1,
                        num_total: 1,
                        remark: 1,
                        quality_type: 1,
                        subquantityitems: 1
                    }
                }
            },
        ])
            
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({ "status": 200, data:documents });
    },

    async store(req, res, next){
        const { report_id, user_id, inputs} = req;
        let current_date = CustomFunction.currentDate();
        let current_time = CustomFunction.currentTime();
        const report_exist = await QuantityReport.exists({report_id: ObjectId(report_id), user_id: ObjectId(user_id),quantity_report_date: current_date});
        let quantity_report_id
        try {
            if (!report_exist) {
                const quantity_report = new QuantityReport({
                    report_id,
                    user_id,
                    quantity_report_date:current_date,
                    quantity_report_time:current_time
                });
                const result = await quantity_report.save();
                quantity_report_id = result._id;
            }else{
                quantity_report_id = report_exist._id;
            }
        } catch (err) {
            return next(err);
        }

        let quantity_reports_exist;
        try {
            inputs.forEach( async (list, key) => {
                quantity_reports_exist = await QuantityWorkItemReport.exists({quantity_report_id: ObjectId(quantity_report_id), item_id:list.item_id });
                if (quantity_reports_exist) {
                    return;
                }
                const quantity_work_item_report = new QuantityWorkItemReport({
                    quantity_report_id:ObjectId(quantity_report_id),

                    item_id : ObjectId(list.item_id),
                    unit_name : list.unit_name,
                    num_length : list.num_length,
                    num_width : list.num_width,
                    num_height : list.num_height,
                    num_total : list.num_total,
                    remark : list.remark,
                    quality_type : list.quality_type,
                });
                const item_result = await quantity_work_item_report.save();
                
                if (list.subquantityitems.length > 0) {
                    list.subquantityitems.forEach(async (sub_list, key1) => {
                        const quantity_work_sub_item_report = await QuantityWorkItemReport.findByIdAndUpdate(
                            { _id:  item_result._id },
                            {
                                $push:{
                                    "subquantityitems": {
                                        sub_length : sub_list.sub_length,
                                        sub_width : sub_list.sub_width,
                                        sub_height : sub_list.sub_height,
                                        sub_total : sub_list.sub_total,
                                        sub_remark : sub_list.sub_remark,
                                        sub_quality_type : sub_list.sub_quality_type
                                    }
                                }
                            },
                            { new: true }
                        );
                    })
                }
            });

            return ({ status:200 });
        } catch (err) {
            return next(err)
        }

    },

    async edit(req, res, next){
        let document;
        try {
            document = await QuantityWorkItemReport.findOne({ _id:req.params.id }).select('-__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        return res.json({"status":200, data:document});
    },

    async update(req, res, next){

        const {inputs} = req.body;
        try {

            inputs.forEach( async (list, key) => {
                const quantity_work_item_report = await QuantityWorkItemReport.findByIdAndUpdate(
                    { _id: req.params.id},
                    {
                        item_id : ObjectId(list.item_id),
                        unit_name : list.unit_name,
                        num_length : list.num_length,
                        num_width : list.num_width,
                        num_height : list.num_height,
                        num_total : list.num_total,
                        remark : list.remark,
                        quality_type : list.quality_type,
                    },
                    {new: true}
                );

                if (list.subquantityitems.length > 0) {
                    const sub_quantity_items = await QuantityWorkItemReport.find({ _id:req.params.id}).select(' _id subquantityitems._id');
                    if(sub_quantity_items.length > 0){
                        sub_quantity_items[0].subquantityitems.forEach(async (list, key1) => {
                            await QuantityWorkItemReport.findOneAndUpdate(
                                { _id: req.params.id},
                                {
                                    $pull: {subquantityitems: {_id : ObjectId(list._id)} } 
                                },
                                { new: true }
                                // false, // Upsert
                                // true, // Multi
                            )
                        })
                    }

                    list.subquantityitems.forEach(async (sub_list, key1) => {
                        await QuantityWorkItemReport.findByIdAndUpdate(
                            { _id:req.params.id },
                            {
                                $push:{
                                    "subquantityitems": {
                                        sub_length : sub_list.sub_length,
                                        sub_width : sub_list.sub_width,
                                        sub_height : sub_list.sub_height,
                                        sub_total : sub_list.sub_total,
                                        sub_remark : sub_list.sub_remark,
                                        sub_quality_type : sub_list.sub_quality_type
                                    }
                                }
                            },
                            { new: true }
                        );
                    })
                }
            });

        } catch (err) {
            return next(err);
        }
        return res.send(CustomSuccessHandler.success(" updated successfully"))
    },

    async quantityItemExist(req, res, next){
        let current_date = CustomFunction.currentDate();
        let item_ids = [];
        try {
            const report_id = await Report.exists({ project_id: req.params.project_id ,report_date:req.params.date });
            if (!report_id) {
                return res.json({"status":401});
            }
            const quantity_report_id = await QuantityReport.exists({ report_id:report_id, user_id:req.params.user_id, quantity_report_date: current_date });
            if (quantity_report_id) {
                item_ids = await QuantityWorkItemReport.find({ quantity_report_id:quantity_report_id }).select('-_id item_id');
            }
            
        } catch (err) {
            return next(err);
        }

        return res.json({"status":200, data:item_ids});
    },

    async quantityReportByReportId(req, res, next){
        let documents;
        try {
            documents = await QuantityReport.aggregate([
                {
                    $match: { 
                        "report_id": ObjectId(req.params.report_id),
                    }
                },
                {
                    $lookup: {
                        from: "quantityWorkItemReports",
                        localField: "_id",
                        foreignField: "quantity_report_id",
                        as: 'quantityWorkItemsReportsData'
                    }
                },
                {
                    $unwind: "$quantityWorkItemsReportsData"
                },
                {
                    $lookup: {
                        from: "quantityReportItems",
                        localField: "quantityWorkItemsReportsData.item_id",
                        foreignField: "_id",
                        as: 'quantityReportItemsData'
                    }
                },
                {
                    $unwind: "$quantityReportItemsData"
                },
                {
                    $group:{
                        _id: "$report_id" ,
                        "main_id": { "$first": "$_id" },
                        "report_id": { "$first": "$report_id" },
                        "user_id": {"$first": "$user_id"},
                        "quantityWorkItems": { "$push": 
                          { 
                              _id: "$quantityWorkItemsReportsData._id",
                              quantity_report_id: "$quantityWorkItemsReportsData.quantity_report_id",
                              item_id: "$quantityWorkItemsReportsData.item_id",
                              item_name: "$quantityReportItemsData.item_name",
                              unit_name: "$quantityWorkItemsReportsData.unit_name",
                              num_length: "$quantityWorkItemsReportsData.num_length",
                              num_width: "$quantityWorkItemsReportsData.num_width",
                              num_height: "$quantityWorkItemsReportsData.num_height",
                              num_total: "$quantityWorkItemsReportsData.num_total",
                              remark: "$quantityWorkItemsReportsData.remark",
                              quality_type: "$quantityWorkItemsReportsData.quality_type",
                              subquantityitems: "$quantityWorkItemsReportsData.subquantityitems",
                          } 
                        },        
                       
                    }
                },
                {
                    $project: {
                        _id: "$main_id",                         
                        report_id:"$_id",     
                        user_id: "$user_id",
                        quantityWorkItems:"$quantityWorkItems"
                    }
                },
                // {
                //     $lookup: {
                //         from: "quantityWorkItemReports",
                //         localField: "_id",
                //         foreignField: "quantity_report_id",
                //         as: 'quantityWorkItemsReportsData'
                //     }
                // },
                // {
                //     $unwind: "$quantityWorkItemsReportsData"
                // },
                // {
                //     $lookup: {
                //         from: "quantityReportItems",
                //         localField: "quantityWorkItemsReportsData.item_id",
                //         foreignField: "_id",
                //         as: 'quantityReportItemsData'
                //     }
                // },
                // {
                //     $unwind: "$quantityReportItemsData"
                // },
                // {
                //   $project: {
                //       _id: 1,
                //       user_id: 1,
                //       report_id: 1,
                //       quantityWorkItems: {
                //           _id: "$quantityWorkItemsReportsData._id",
                //           quantity_report_id: "$quantityWorkItemsReportsData.quantity_report_id",
                //           item_id: "$quantityWorkItemsReportsData.item_id",
                //           item_name: "$quantityReportItemsData.item_name",
                //           unit_name: "$quantityWorkItemsReportsData.unit_name",
                //           num_length: "$quantityWorkItemsReportsData.num_length",
                //           num_width: "$quantityWorkItemsReportsData.num_width",
                //           num_height: "$quantityWorkItemsReportsData.num_height",
                //           num_total: "$quantityWorkItemsReportsData.num_total",
                //           remark: "$quantityWorkItemsReportsData.remark",
                //           quality_type: "$quantityWorkItemsReportsData.quality_type",
                //           subquantityitems: "$quantityWorkItemsReportsData.subquantityitems",
                //       }
                //     }
                // },

            ]);
        } catch (err) {
            return next(err);
        }
        return res.json({"status":200, data:documents});
    }
    // async storeOld(req, res, next){

    //     const { report_id, user_id, inputs} = req;
    //     const report_exist = await QuantityReport.exists({report_id: ObjectId(report_id), user_id: ObjectId(user_id)});


    //     let quantity_report_id
    //     try {
    //         if (!report_exist) {
    //             const quantity_report = new QuantityReport({
    //                 report_id,
    //                 user_id
    //             });
    //             const result = await quantity_report.save();
    //             quantity_report_id = result._id;
    //         }else{
    //             quantity_report_id = report_exist._id;
    //         }
    //     } catch (err) {
    //         return next(err);
    //     }

    //     let current_date = CustomFunction.currentDate();
    //     let current_time = CustomFunction.currentTime();

    //     try {
    //         const date_report = await QuantityReport.findOne({
    //             $and: [
    //                 {
    //                     _id: { $eq: ObjectId(quantity_report_id) }, 
    //                     dates: { 
    //                         $elemMatch: { quantity_report_date: current_date}, 
    //                     }
    //                 }
    //             ]
    //         })

    //         if (!date_report) {
    //             await QuantityReport.findByIdAndUpdate(
    //                 { _id: ObjectId(quantity_report_id) },
    //                 {
    //                     $push:{
    //                         dates: {
    //                             quantity_report_date:current_date,
    //                             quantity_report_time:current_time
    //                         } 
    //                     } 
    //                 },
    //                 { new: true }
    //             )
    //         }

    //     } catch (err) {
    //         return next(err);
    //     }

    //     let quantity_reports;
    //     try {
            
    //         inputs.forEach( async (list, key) => {

    //             quantity_reports = await QuantityReport.find({
    //                 _id: { $eq: ObjectId(quantity_report_id) }, 
    //                 dates: { 
    //                     $elemMatch: { quantity_report_date: current_date}, 
    //                 },
    //                 "dates.quantityitems.item_id": ObjectId(list.item_id)
    //             })

    //             if (quantity_reports.length > 0) {
    //                 return;
    //             }
                
    //             const quantityitemData = await QuantityReport.findOneAndUpdate(
    //                 {
    //                     $and: [
    //                         {
    //                             _id: { $eq: ObjectId(quantity_report_id) },
    //                             dates: { $elemMatch: { quantity_report_date: current_date}, }
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     $push:{
    //                         "dates.$.quantityitems": {
    //                             item_id : ObjectId(list.item_id),
    //                             unit_name: list.unit_name,
    //                             num_length : list.num_length,
    //                             num_width : list.num_width,
    //                             num_height : list.num_height,
    //                             num_total : list.num_total,
    //                             remark : list.remark,
    //                         }
    //                     }
    //                 },
    //                 { new: true }
    //             );

    //             if (list.subquantityitems.length > 0) {
    //                 list.subquantityitems.forEach( async (sub_list, key1) => {

    //                     await QuantityReport.updateOne(
    //                         {
    //                             $and: [
    //                                 {
    //                                     _id: { $eq: ObjectId(quantity_report_id) },
    //                                     dates: { $elemMatch: { quantity_report_date: current_date}, },
    //                                     "dates.quantityitems.item_id": list.item_id
    //                                 }
    //                             ]
    //                         },
    //                         {
    //                             $push: {
    //                                 "dates.$.quantityitems.$[qitem].subquantityitems": {
    //                                     sub_length: sub_list.sub_length,
    //                                     sub_width: sub_list.sub_width,
    //                                     sub_height: sub_list.sub_height,
    //                                     sub_total: sub_list.sub_total,
    //                                     sub_remark: sub_list.sub_remark,
    //                                 }
    //                             }
    //                         },
    //                         {
    //                             arrayFilters: [
    //                                 {
    //                                     "qitem.item_id": list.item_id
    //                                 }
    //                             ]
    //                         }
                            
    //                     )
    //                 });
    //             }

    //         });

    //         return ({ status:200 });
    //     } catch (err) {
    //         return err;
    //     }
    //     // res.send(CustomSuccessHandler.success('Quantity item report created successfully'));
    // }

}

export default QuantityReportController;