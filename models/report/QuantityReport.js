import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const quantityReportSchema = mongoose.Schema({
    report_id:{ type: ObjectId },
    quantity: [{
        particular: { type: String },
        length: { type: Number }, 
        width: { type: Number }, 
        height: { type: Number }, 
        qty: { type: Number }, 
        item_id: { type: ObjectId }, 
    }]

});

export default mongoose.model('QuantityReport', quantityReportSchema, 'quantityReports');