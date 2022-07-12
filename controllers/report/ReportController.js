import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import { reportSchema } from "../../validators/index.js";
import { Report, QuantityReport } from "../../models/index.js";
import Constants from "../../constants/index.js";
import QuantityReportController from './QuantityReportController.js';

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
            const {project_id, user_id} = req.body;
            const exist = await Report.exists({project_id:req.body.project_id});
            if (!exist) {
                const report = new Report({
                    project_id:project_id,
                    user_id:user_id,
                }) ;
                const result = await report.save();
            }

            switch (req.params.type) {

                case Constants.MANPOWER:
                    console.log("Manpower")
                    break;
                case Constants.STOCK:
                    console.log("Stock")
                    break;
                case Constants.QUANTITY:

                    const bodyData = {
                        particular:req.body.particular,
                        length:req.body.length,
                        width:req.body.width,
                        height:req.body.height,
                        qty:req.body.qty,
                        item_id:req.body.item_id,
                    }
                    const data = QuantityReportController.nextTesting(bodyData);
                    
                    // const data = QuantityReportController.store(); //final call
                    console.log(data)
                    break;
                case Constants.QUALITY:
                    console.log("Quality")
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
    }

}

export default ReportController;