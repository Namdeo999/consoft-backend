import { QuantityReport } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";

const QuantityReportController = {

    async store(req, res, next){
        //validation

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
            res.send(CustomSuccessHandler.success('Project created successfully'));
        } catch (err) {
            return next(err);
        }

    }

}

export default QuantityReportController;