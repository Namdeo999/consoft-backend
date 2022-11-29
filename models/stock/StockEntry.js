import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const stockEntrySchema = mongoose.Schema({
    stock_id: { type: ObjectId},
    item_id: {type: ObjectId},
    unit_id: {type: ObjectId},
    // unit_name: { type: String},
    qty: {type:Number, required:true},
    // location: { type: String},
    // vehicle_no: { type: String},
})

export default mongoose.model('StockEntry', stockEntrySchema, 'stockEntries');