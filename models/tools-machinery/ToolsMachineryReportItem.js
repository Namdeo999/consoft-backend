import { ObjectId, Timestamp } from "mongodb";
import mongoose from "mongoose";
import CustomFunction from "../../services/CustomFunction.js";

const date = CustomFunction.currentDate();
const time = CustomFunction.currentTime();

const toolsMachineryReportItemSchema = mongoose.Schema({

    equipment_report_Id:{ type: ObjectId },    
    equipment_id: { type: ObjectId },    
    qty: { type: Number },
    onDateChange: { type: String }
    
})

export default mongoose.model('ToolsMachineryReportItem', toolsMachineryReportItemSchema, 'toolsMachineryReportItem');