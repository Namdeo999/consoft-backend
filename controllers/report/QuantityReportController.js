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
        //validation

        // const data = ReportController.saveReport(); //final call
        // console.log(data)
        // return ;
        const { project_id, user_id, item_id, length, width, height, qty, remark } = req;
        const quantity_report = new QuantityReport({
            report_id,
            project_id,
            quantity_report:{
                user_id,
                item_id,
                length,
                width,
                height,
                qty,
                remark,
            }
        }) ;

        try {
            const result = await quantity_report.save();
            // res.status(200).send({ "status": "success", "message": "Project created" })
            // const doc = ({
            //     status:200,
            //     msg:"Project created successfully"
            // });
            // return doc;
            res.send(CustomSuccessHandler.success('Project created successfully'));
        } catch (err) {
            return next(err);
        }

    },

    async nextTesting(req, res, next){

        const { report_id, user_id, item_id, length, width, height, qty, remark } = req;
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
                await QuantityReport.findOneAndUpdate(
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
                                qty : qty[key],
                                remark : remark[key]
                            }
                        }
                    },

                    { new: true }
                )

            });

            return ({ status:200 });
        } catch (err) {
            return err;
        }
        // res.send(CustomSuccessHandler.success('Quantity item report created successfully'));
    }

}

export default QuantityReportController;