import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import CustomFunction from "../../services/CustomFunction.js";
import { SubWorkAssign } from "../../models/index.js";
import Joi from "joi";

const RevertController = {

    async revertSubmitWork(req, res, next){
        const revertSchema = Joi.object({
            revert_msg:Joi.string().required()
        });

        const {error} = revertSchema.validate(req.body);
        if (error) {
            return next(error);
        }

        try {
            const { revert_msg } = req.body;
            const subwork_assign = await SubWorkAssign.findByIdAndUpdate(
                { _id: req.params.work_id },
                {
                    revert_msg:revert_msg,
                    revert_status:true,
                    work_status:false,
                },
                { new: true }

            ).select('-__v');

            res.send(CustomSuccessHandler.success("Revert successfully!"))
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
    }

}

export default RevertController;