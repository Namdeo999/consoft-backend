import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import CustomFunction from "../../services/CustomFunction.js";

const date = CustomFunction.currentDate();
const time = CustomFunction.currentTime();

const manageStockSchema = mongoose.Schema({
    company_id: {type: ObjectId, required:true},
    project_id: {type: ObjectId, required:true},
    stock_date:{ type: String, default: date },
    stock_time:{ type: String, default: time }
    // user_id: {type: ObjectId, required:true},
})

export default mongoose.model('ManageStock', manageStockSchema, 'manageStock');

