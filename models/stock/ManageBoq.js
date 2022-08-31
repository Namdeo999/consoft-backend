import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const manageBoqSchema = mongoose.Schema({
    company_id:{ type: ObjectId, required:true },
    project_id:{ type: ObjectId, required:true },
    item_id:{ type: ObjectId, required:true },
    unit_name:{ type: String, required:true },
    qty:{ type: String, required:true }

    // company_id:{ type: ObjectId },
    // project_id:{ type: ObjectId },
    // boqitems:[{
    //     item_id: { type: ObjectId},
    //     unit_id: { type: ObjectId},
    //     qty: { type: String},
    // }]

});

export default mongoose.model('ManageBoq', manageBoqSchema, 'manageBoq');