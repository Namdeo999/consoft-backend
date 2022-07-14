import { QuantityReport } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import CustomFunction from "../../services/CustomFunction.js";

import ReportController from "./ReportController.js";



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
        const { report_id, particular, length, width, height, qty, item_id } = req.body;
        const quantity_report = new QuantityReport({
            report_id,
            quantity:{
                particular,
                length,
                width,
                height,
                qty,
                item_id
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

    nextTesting(req, res, next){
        return req.body.particular;
    }

}

export default QuantityReportController;