import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const manpowerMemberReportSchema = mongoose.Schema({
    manpower_report_id:{ type: ObjectId },
    manpower_sub_category_id:{ type: ObjectId },
    manpower_member:{ type: Number },
});

export default mongoose.model('ManpowerMemberReport', manpowerMemberReportSchema, 'manpowerMemberReports');