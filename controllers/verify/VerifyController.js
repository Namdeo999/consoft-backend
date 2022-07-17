import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import { SubWorkAssign } from "../../models/index.js";
import CustomFunction from "../../services/CustomFunction.js";

const VerifyController = {
    async verifySubmitWork(req, res, next){
        try {
            const verify_date = CustomFunction.currentDate();
            const verify_time = CustomFunction.currentTime();
            const verify = await SubWorkAssign.findByIdAndUpdate(
                { _id: req.params.work_id },
                {
                    verify_date:verify_date,
                    verify_time:verify_time,
                    verify:true,
                },
                { new: true }

            ).select('-__v');

            res.send(CustomSuccessHandler.success("Verify successfully!"))
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
    }
}

export default VerifyController;