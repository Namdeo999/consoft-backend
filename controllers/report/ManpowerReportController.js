import { ManpowerReport, ManpowerMemberReport } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import CustomFunction from "../../services/CustomFunction.js";
import { ObjectId } from "mongodb";

const ManpowerReportController = {

    async store(req, res, next){
        const {report_id, user_id, contractor_id, manpower_category_id, members} = req;
        let current_date = CustomFunction.currentDate();
        let current_time = CustomFunction.currentTime();
    
        const report_exist = await ManpowerReport.exists({report_id: ObjectId(report_id), contractor_id: ObjectId(contractor_id),manpower_category_id: ObjectId(manpower_category_id),quantity_report_date: current_date});
        let manpower_report_id
        try {
            if (!report_exist) {
                const manpower_report = new ManpowerReport({
                    report_id,
                    user_id,
                    contractor_id,
                    manpower_category_id,
                    manpower_report_date:current_date,
                    manpower_report_time:current_time
                });
                const result = await manpower_report.save();
                manpower_report_id = result._id;
            }else{
                manpower_report_id = report_exist._id;
            }
        } catch (err) {
            return next(err);
        }
        let manpower_reports_exist;
        
        try {
            members.forEach( async (list, key) => {
                // manpower_reports_exist = await ManpowerMemberReport.exists({manpower_report_id: ObjectId(manpower_report_id), manpower_sub_category_id:list.manpower_sub_category_id });
                manpower_reports_exist =  ManpowerMemberReport.find({
                    $and: [
                        { manpower_report_id: { $eq: ObjectId(manpower_report_id) }, manpower_sub_category_id: { $eq: ObjectId(list.manpower_sub_category_id) } } 
                    ]
                })
                if (manpower_reports_exist) {
                    return ;
                }
                const manpower_member_report = new ManpowerMemberReport({
                    manpower_report_id:ObjectId(manpower_report_id),

                    manpower_sub_category_id : ObjectId(list.manpower_sub_category_id),
                    manpower_member : list.manpower_member,
                });
                const member_result = await manpower_member_report.save();
            });
            return ({ status:200 });
        } catch (err) {
            return ({status:400, error:"Something went wrong"});
        }
    }

}

export default ManpowerReportController;