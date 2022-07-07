import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const quantityReportItemSchema = mongoose.Schema({
    item_name:{ type: String },
    unit_id:{ type: ObjectId }
});

export default mongoose.model('QuantityReportItem', quantityReportItemSchema, 'quantityReportItems');