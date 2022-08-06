import { QuantityReport, QuantityWorkItemReport } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import CustomFunction from "../../services/CustomFunction.js";

import ReportController from "./ReportController.js";
import { ObjectId } from "mongodb";



const QuantityReportController = {

    async index(req, res, next){

        let documents; 
        try {
            documents = await QuantityReport.find();
            // documents = await QuantityReport.aggregate([
                // {
                //     $match: { 
                //         $and:[
                //             {"user_id": ObjectId(req.params.user_id)},
                //         ]
                //     },
                // },

                // {
                //     $addFields: {
                //         'quantityitems': {
                //             $map: {
                //                 input: "$quantityitems",
                //                 in: {
                //                     $mergeObjects: [
                //                     "$$this",
                //                         {
                //                             item_id: {
                //                                 $toObjectId: "$$this.item_id"
                //                             }
                //                         }
                //                     ]
                //                 }
                //             }
                //         }
                //     }
                // },

                // {
                //     "$unwind": "$quantityitems"
                // },

                // {
                //     $lookup: {
                //         from: 'quantityReportItems',
                //         localField: 'dates.quantityitems.item_id',
                //         foreignField: '_id',
                //         as: 'reportItemData'
                //     },
                // },

                // {
                //     $project: {
                //         _id: 1,
                //         report_id: 1,
                //         user_id: 1,
                //         dates: {
                //             quantity_report_date:1,
                //             quantity_report_time:1,
                //             _id:1,
                //         },

                //         "dates": {
                //             "quantityitems": {
                //               $m: [
                //                 "$reportItemData",
                //                 0
                //               ]
                //             },
                            
                //           }
                        
                        
                //     }
                // },

                // {
                //     "$group": {
                //       "_id": "$_id",
                //       "quantityitems": {
                //         $push: "$quantityitems"
                //       }
                //     }
                // }
                
                // {
                //     $project: {
                //         _id: 1,
                //         report_id: 1,
                //         user_id: 1,
                //         dates: {
                //             quantity_report_date:1,
                //             quantity_report_time:1,
                //             _id:1,
                //         },
                //         'dates.quantityitems':{
                //             item_id:1,
                //             unit_name:1,
                //             item_idd:'$reportItemData._id',
                //             item_name:'$reportItemData.item_name',
                //             // $map: {
                //             //     input: "$quantityitems",
                //             //     as: "i",
                //             //     in: { 
                //             //         $mergeObjects: 
                //             //         [ "$$i",
                //             //             {
                //             //                 $first: {
                //             //                     $filter: {
                //             //                         input: "$reportItemData",
                //             //                         cond: 
                //             //                             { $eq: ["$$this._id","$$i.item_id"] },
                //             //                     },
                //             //                 },
                //             //             },
                //             //         ]
                //             //     },
                //             // },

                //         }




                //    }
                // }

            // ])



        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({ "status":200, data:documents });

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

        let quantity_reports;
        try {

            console.log(inputs);
            inputs.forEach( async (list, key) => {
                
                quantity_reports = await QuantityReport.find({
                    _id: { $eq: ObjectId(quantity_report_id) }, 
                    quantity_report_date: { $eq: current_date }, 
                })

                if (quantity_reports.length > 0) {
                    return;
                }

                console.log(quantity_reports);


            });

        } catch (err) {
            return next(err)
        }

    },

    async storeOld(req, res, next){

        const { report_id, user_id, inputs} = req;
        const report_exist = await QuantityReport.exists({report_id: ObjectId(report_id), user_id: ObjectId(user_id)});


        let quantity_report_id
        try {
            if (!report_exist) {
                const quantity_report = new QuantityReport({
                    report_id,
                    user_id
                });
                const result = await quantity_report.save();
                quantity_report_id = result._id;
            }else{
                quantity_report_id = report_exist._id;
            }
        } catch (err) {
            return next(err);
        }

        let current_date = CustomFunction.currentDate();
        let current_time = CustomFunction.currentTime();

        try {
            const date_report = await QuantityReport.findOne({
                $and: [
                    {
                        _id: { $eq: ObjectId(quantity_report_id) }, 
                        dates: { 
                            $elemMatch: { quantity_report_date: current_date}, 
                        }
                    }
                ]
            })

            if (!date_report) {
                await QuantityReport.findByIdAndUpdate(
                    { _id: ObjectId(quantity_report_id) },
                    {
                        $push:{
                            dates: {
                                quantity_report_date:current_date,
                                quantity_report_time:current_time
                            } 
                        } 
                    },
                    { new: true }
                )
            }

        } catch (err) {
            return next(err);
        }

        let quantity_reports;
        try {
            // const report_exist = await QuantityReport.exists({_id: ObjectId(quantity_report_id), project_id: ObjectId(project_id)});
            // console.log(inputs);

            inputs.forEach( async (list, key) => {

                quantity_reports = await QuantityReport.find({
                    _id: { $eq: ObjectId(quantity_report_id) }, 
                    dates: { 
                        $elemMatch: { quantity_report_date: current_date}, 
                    },
                    "dates.quantityitems.item_id": ObjectId(list.item_id)
                })

                if (quantity_reports.length > 0) {
                    return;
                }
                
                const quantityitemData = await QuantityReport.findOneAndUpdate(
                    {
                        $and: [
                            {
                                _id: { $eq: ObjectId(quantity_report_id) },
                                dates: { $elemMatch: { quantity_report_date: current_date}, }
                            }
                        ]
                    },
                    {
                        $push:{
                            "dates.$.quantityitems": {
                                item_id : ObjectId(list.item_id),
                                unit_name: list.unit_name,
                                num_length : list.num_length,
                                num_width : list.num_width,
                                num_height : list.num_height,
                                num_total : list.num_total,
                                remark : list.remark,
                            }
                        }
                    },
                    { new: true }
                );

                if (list.subquantityitems.length > 0) {
                    list.subquantityitems.forEach( async (sub_list, key1) => {

                        await QuantityReport.updateOne(
                            {
                                $and: [
                                    {
                                        _id: { $eq: ObjectId(quantity_report_id) },
                                        dates: { $elemMatch: { quantity_report_date: current_date}, },
                                        "dates.quantityitems.item_id": list.item_id
                                        // quantityitems: { $elemMatch: { item_id: item_id[key]}, }
                                    }
                                ]
                            },
                            {
                                $push: {
                                    "dates.$.quantityitems.$[qitem].subquantityitems": {
                                        sub_length: sub_list.sub_length,
                                        sub_width: sub_list.sub_width,
                                        sub_height: sub_list.sub_height,
                                        sub_total: sub_list.sub_total,
                                        sub_remark: sub_list.sub_remark,
                                    }
                                }
                            },
                            {
                                arrayFilters: [
                                    {
                                        "qitem.item_id": list.item_id
                                    }
                                ]
                            }
                            
                        )
                    });
                }

            });

            return ({ status:200 });
        } catch (err) {
            return err;
        }
        // res.send(CustomSuccessHandler.success('Quantity item report created successfully'));
    }

}

export default QuantityReportController;