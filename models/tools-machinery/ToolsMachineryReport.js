import { ObjectId, Timestamp } from "mongodb";
import mongoose from "mongoose";
import CustomFunction from "../../services/CustomFunction.js";

const date = CustomFunction.currentDate();
const time = CustomFunction.currentTime();

const toolsMachineryReportSchema = mongoose.Schema({
    
    report_id:{ type: ObjectId },
    user_id:{ type: ObjectId },   
    equipment_report_date: { type: String, default: date },
    equipment_report_time: { type: String, default: time },
    
})

export default mongoose.model('ToolsMachineryReport', toolsMachineryReportSchema, 'toolsMachineryReport');