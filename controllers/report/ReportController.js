import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import { reportSchema } from "../../validators/index.js";
import { Report } from "../../models/index.js";
import Constants from "../../constants/index.js";
import QuantityReportController from './QuantityReportController.js';
import ManpowerReportController from "./ManpowerReportController.js";


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
            const {company_id, project_id, user_id} = req.body;
            const exist = await Report.exists({company_id:company_id, project_id:project_id});
            let report_id ;
            
            if (!exist) {
                const report = new Report({
                    company_id:company_id,
                    project_id:project_id,
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
    }

}

export default ReportController;