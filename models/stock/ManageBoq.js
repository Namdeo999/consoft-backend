import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const manageBoqSchema = mongoose.Schema({
    // company_id:{ type: ObjectId },
    // project_id:{ type: ObjectId },
    // item_id:{ type: ObjectId },
    // unit_id:{ type: ObjectId },
    // qty:{ type: String }

    company_id:{ type: ObjectId },
    project_id:{ type: ObjectId },
    boqitems:[{
        item_id: { type: ObjectId},
        unit_id: { type: ObjectId},
        qty: { type: String},
    }]

    // company_id:{ type: ObjectId },
    // projects:[{
    //     project_id:{ type: ObjectId },
    //     boqitems:[{
    //         item_id: { type: ObjectId},
    //         unit_id: { type: ObjectId},
    //         qty: { type: String},
    //     }]
    // }]


});

export default mongoose.model('ManageBoq', manageBoqSchema, 'manageBoq');