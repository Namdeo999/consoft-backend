import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import CustomFunction from "../../services/CustomFunction.js";

const date = CustomFunction.currentDate();
const time = CustomFunction.currentTime();

const quantityReportSchema = mongoose.Schema({
    report_id:{ type: ObjectId },
    project_id:{ type: ObjectId },
    users:[{
        user_id:{ type: ObjectId },
        quantity_report_date:{ type:String, default:date },
        quantity_report_time:{ type:String, default:time },
        status:{ type:Boolean, default:false},
        items:[{
            item_id: { type: ObjectId }, 
            length: { type: Number }, 
            width: { type: Number }, 
            height: { type: Number }, 
            qty: { type: Number }, 
            remark: { type: String },
        }]
    }]


    // quantity_report: [{
    //     user_id:{ type: ObjectId },
    //     item_id: { type: ObjectId }, 
    //     length: { type: Number }, 
    //     width: { type: Number }, 
    //     height: { type: Number }, 
    //     qty: { type: Number }, 
    //     remark: { type: String },
    //     quantity_report_date:{ type:String, default:date },
    //     quantity_report_time:{ type:String, default:time },
    // }]

});

export default mongoose.model('QuantityReport', quantityReportSchema, 'quantityReports');