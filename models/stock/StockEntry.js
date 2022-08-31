import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const stockEntrySchema = mongoose.Schema({
    stock_id: { type: ObjectId},
    item_id: {type: ObjectId, required:true},
    unit_name: { type: String, required: true},
    qty: {type:Number, required:true},
    location: { type: String, required: true},
    vehicle_no: { type: String, required: true},
})

export default mongoose.model('StockEntry', stockEntrySchema, 'stockEntries');