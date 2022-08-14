import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import CustomFunction from "../../services/CustomFunction.js";

const date = CustomFunction.currentDate();
const time = CustomFunction.currentTime();

const manpowerReportSchema = mongoose.Schema({
    report_id:{ type: ObjectId },
    user_id:{ type: ObjectId },
    contractor_id:{ type: ObjectId },
    manpower_category_id:{ type: ObjectId },
    manpower_report_date:{ type:String, default:date },
    manpower_report_time:{ type:String, default:time }, 

});

export default mongoose.model('ManpowerReport', manpowerReportSchema, 'manpowerReports');