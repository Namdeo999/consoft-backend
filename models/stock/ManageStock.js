import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const manageStockSchema = mongoose.Schema({
    item_id: {type: ObjectId, required:true},
    qty: {type:Number, required:true},
    location: { type: String, required: true},
    vehicle_no: { type: String, required: true},
})

export default mongoose.model('ManageStock', manageStockSchema, 'manageStock');