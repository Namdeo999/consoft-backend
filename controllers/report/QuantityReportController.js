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

        const { report_id, project_id, user_id, item_id, length, width, height, qty, remark } = req;

        // const project_exist = await ProjectTeam.findOne({ project_id: ObjectId(project_id) }).select('_id');
        const report_exist = await QuantityReport.exists({report_id: ObjectId(report_id), project_id: ObjectId(project_id)});
        
        let quantity_report_id
        if (!report_exist) {
            const quantity_report = new QuantityReport({
                report_id,
                project_id
            });
            const result = await quantity_report.save();
            quantity_report_id = result._id;
        }else{
            quantity_report_id = report_exist._id;
        }


        try {

            // const report_exist = await QuantityReport.exists({_id: ObjectId(quantity_report_id), project_id: ObjectId(project_id)});
            let current_date = CustomFunction.currentDate();
            let current_time = CustomFunction.currentTime();
            const user_report = await QuantityReport.findOne({
                $and: [
                    {
                        _id: { $eq: ObjectId(quantity_report_id) }, 
                        users: { 
                            $elemMatch: { user_id: ObjectId(user_id)}, 
                            $elemMatch: { quantity_report_date: current_date}, 
                            // {quantity_report_date: current_date} 
                        } 
                    }
                ]
            })
            
            if (!user_report) {
                
            }else{
                
            }

         

            let quantity_reports;

            item_id.forEach( async (element, key) => {
                // quantity_reports = await QuantityReport.find({
                //     $and: [
                //         {
                //             _id: { $eq: ObjectId(quantity_report_id) }, 
                //             quantity_report: { $elemMatch: { item_id: ObjectId(element) } } 
                //         }
                //     ]
                // })
    
                // if (quantity_reports.length === 0) {
                //     await QuantityReport.findByIdAndUpdate(
                //         { _id: ObjectId(quantity_report_id) },
                //         // { $push: {users: {user_id : user_id,} } }, // single code insert
                //         {
                //             $push:{
                //                 quantity_report: {
                //                     user_id : ObjectId(user_id),
                //                     item_id : ObjectId(element),
                //                 } 
                //             } 
                //         },
                //         { new: true }
                //     )
                // }
                // console.log(element);
                // console.log(key);
            });
        } catch (err) {
            
        }



    }

}

export default QuantityReportController;