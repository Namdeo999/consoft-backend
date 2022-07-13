import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import { SubWorkAssign } from "../../models/index.js";

const VerifyController = {
    async verifySubmitWork(req, res, next){
        try {
            
            const verify = await SubWorkAssign.findByIdAndUpdate(
                { _id: req.params.work_id },
                {
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