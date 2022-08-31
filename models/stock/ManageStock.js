import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const manageStockSchema = mongoose.Schema({
    company_id: {type: ObjectId, required:true},
    project_id: {type: ObjectId, required:true},
    user_id: {type: ObjectId, required:true},
})

export default mongoose.model('ManageStock', manageStockSchema, 'manageStock');

