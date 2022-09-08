import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import CustomFunction from "../../services/CustomFunction.js";
import { SubWorkAssign, Report, ProjectReportPath } from "../../models/index.js";
import Joi from "joi";
import Constants from "../../constants/index.js";

const RevertController = {

    async revertSubmitWork(req, res, next){
        const revertSchema = Joi.object({
            revert_msg:Joi.string().required(),
            work_percent:Joi.number().required()
        });

        const {error} = revertSchema.validate(req.body);
        if (error) {
            return next(error);
        }

        try {
            const { revert_msg, work_percent } = req.body;
            const subwork_assign = await SubWorkAssign.findByIdAndUpdate(
                { _id: req.params.work_id },
                {
                    revert_msg:revert_msg,
                    work_percent:work_percent,
                    revert_status:true,
                    work_status:false,
                },
                { new: true }

            ).select('-__v');

        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        res.send(CustomSuccessHandler.success("Revert successfully!"))
    },

    async revertReport(req, res, next){
        const revertSchema = Joi.object({
            revert_msg:Joi.string().required()
        });

        const {error} = revertSchema.validate(req.body);
        if (error) {
            return next(error);
        }

        let current_date = CustomFunction.currentDate();
        let current_time = CustomFunction.currentTime();
        let { project_id, report_id, user_id} = req.params;
        try {
            const { revert_msg } = req.body;
            const project_path = await ProjectReportPath.findOne({project_id:project_id}).select('-createdAt -updatedAt -__v');
            if (project_path) {
                if (project_path.verification_1.toString() === user_id) {
                    const report_data = await Report.findById({_id:report_id}).select('verify_1_status verify_1_revert');
                    if (report_data.verify_1_status === Constants.VERIFY ) {
                        return next(CustomErrorHandler.inValid('Cant revert this report is already verified'));
                    }
                    if (report_data.verify_1_revert === Constants.REVERT ) {
                        return next(CustomErrorHandler.inValid('Cant revert this report is already reverted'));
                    }

                    try {
                        await Report.findByIdAndUpdate(
                            {_id:report_id},
                            {
                                verify_1_revert:Constants.REVERT,
                                verify_1_revert_date:current_date,
                                verify_1_revert_time:current_time,
                                verify_1_revert_msg:revert_msg,
                            },
                            {new: true}
                        ).select('-__v');
                    } catch (err) {
                        return next(err)
                    }

                }else if (project_path.admin_1.toString() === user_id) {
                    const report_data = await Report.findById({_id:report_id}).select('admin_1_status admin_1_revert');
                    if (report_data.admin_1_status === Constants.VERIFY ) {
                        return next(CustomErrorHandler.inValid('Cant revert this report is already verified'));
                    }
                    if (report_data.admin_1_revert === Constants.REVERT ) {
                        return next(CustomErrorHandler.inValid('Cant revert this report is already reverted'));
                    }

                    try {
                        await Report.findByIdAndUpdate(
                            {_id:report_id},
                            {
                                verify_1_status:false,
                                admin_1_revert:Constants.REVERT,
                                admin_1_revert_date:current_date,
                                admin_1_revert_time:current_time,
                                admin_1_revert_msg:revert_msg,
                            },
                            {new: true}
                        ).select('-__v');
                    } catch (err) {
                        return next(err)
                    }

                }else if (project_path.admin_2.toString() === user_id) {
                    const report_data = await Report.findById({_id:report_id}).select('admin_2_status admin_2_revert');
                    if (report_data.admin_2_status === Constants.VERIFY ) {
                        return next(CustomErrorHandler.inValid('Cant revert this report is already verified'));
                    }
                    if (report_data.admin_2_revert === Constants.REVERT ) {
                        return next(CustomErrorHandler.inValid('Cant revert this report is already reverted'));
                    }

                    try {
                        await Report.findByIdAndUpdate(
                            {_id:report_id},
                            {
                                admin_1_status:false,
                                admin_2_revert:Constants.REVERT,
                                admin_2_revert_date:current_date,
                                admin_2_revert_time:current_time,
                                admin_2_revert_msg:revert_msg,
                            },
                            {new: true}
                        ).select('-__v');
                    } catch (err) {
                        return next(err)
                    }

                }else{
                    return next(CustomErrorHandler.inValid('Out of privilege'));
                }
            }
            
        } catch (err) {
            return next(err)
        }
        res.send(CustomSuccessHandler.success("Reverted successfully!"))
    }

}

export default RevertController;