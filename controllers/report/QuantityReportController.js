import { QuantityReport } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import CustomFunction from "../../services/CustomFunction.js";

import ReportController from "./ReportController.js";
import { ObjectId } from "mongodb";



const QuantityReportController = {

    async index(req, res, next){

        // console.log(CustomFunction.dateFormat(new Date('2022-07-12')));
        // console.log(CustomFunction.dateFormat('2022-07-12'));

        let documents; 
        try {
            documents = await QuantityReport.find();
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);

    },

    async store(req, res, next){

        const { report_id, user_id, item_id, length, width, height, total, remark, sub_length, sub_width, sub_height, sub_total, sub_remark } = req;
        // const project_exist = await ProjectTeam.findOne({ project_id: ObjectId(project_id) }).select('_id');
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
            item_id.forEach( async (element, key) => {
                quantity_reports = await QuantityReport.find({
                    $and: [
                        {
                            _id: { $eq: ObjectId(quantity_report_id) },
                            dates: { 
                                $elemMatch: { quantity_report_date: current_date}, 
                            },
                            dates: { 
                                quantityitems: { $elemMatch: { item_id: ObjectId(element) } }
                            }
                        } 
                    ]
                })
                
                // if (quantity_reports.length > 0) {
                //     return next(CustomErrorHandler.alreadyExist('This Item name is already exist'));
                // }
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
                                item_id : ObjectId(element),
                                length : length[key],
                                width : width[key],
                                height : height[key],
                                total : total[key],
                                remark : remark[key],
                            }
                        }
                    },
                    { new: true }

                );
                
                sub_length[key].forEach( async (sub_length_ele, key1) => {
                    // console.log(key1)
                    await QuantityReport.updateOne(
                        {
                            $and: [
                                {
                                    _id: { $eq: ObjectId(quantity_report_id) },
                                    dates: { $elemMatch: { quantity_report_date: current_date}, },
                                    "dates.quantityitems.item_id": item_id[key]
                                    // quantityitems: { $elemMatch: { item_id: item_id[key]}, }
                                }
                            ]
                        },
                        {
                            $push: {
                                "dates.$.quantityitems.$[qitem].subquantityitems": {
                                    sub_length: sub_length_ele,
                                    sub_width: sub_width[key][key1],
                                    sub_height: sub_height[key][key1],
                                    sub_total: sub_total[key][key1],
                                    sub_remark: sub_remark[key][key1],
                                }
                            }
                        },
                        {
                            arrayFilters: [
                                {
                                    "qitem.item_id": element
                                }
                            ]
                        }
                        
                    )
                });

                
            });

            return ({ status:200 });
        } catch (err) {
            return err;
        }
        // res.send(CustomSuccessHandler.success('Quantity item report created successfully'));
    }

}

export default QuantityReportController;