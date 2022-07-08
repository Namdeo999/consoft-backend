import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import { reportSchema } from "../../validators/index.js";
import { Report } from "../../models/index.js";
import QuantityReportController from './QuantityReportController.js';

const ReportController = {

    async saveReport(req, res, next){

        const {error} = reportSchema.validate(req.body);
        if(error){
            return next(error);
        }

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