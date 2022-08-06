import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const quantityWorkItemReportSchema = mongoose.Schema({
    quantity_report_id:{ type: ObjectId },
    item_id: { type: ObjectId }, 
    num_length: { type: Number }, 
    num_width: { type: Number }, 
    num_height: { type: Number }, 
    num_total: { type: Number }, 
    remark: { type: String },
    subquantityitems:[{
        sub_length: { type: Number }, 
        sub_width: { type: Number }, 
        sub_height: { type: Number }, 
        sub_total: { type: Number }, 
        sub_remark: { type: String },
    }]
});

export default mongoose.model('QuantityWorkItemReport', quantityWorkItemReportSchema, 'quantityWorkItemReports');