import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import CustomFunction from "../../services/CustomFunction.js";

const date = CustomFunction.currentDate();
const time = CustomFunction.currentTime();

const quantityReportSchema = mongoose.Schema({
    // report_id:{ type: ObjectId },
    // user_id:{ type: ObjectId },
    // dates:[{
    //     quantity_report_date:{ type:String, default:date },
    //     quantity_report_time:{ type:String, default:time },
    //     status:{ type:Boolean, default:false},
    //     quantityitems:[{
    //         item_id: { type: ObjectId }, 
    //         unit_name: { type: String }, 
    //         num_length: { type: Number }, 
    //         num_width: { type: Number }, 
    //         num_height: { type: Number }, 
    //         num_total: { type: Number }, 
    //         remark: { type: String },
    //         subquantityitems:[{
    //             sub_length: { type: Number }, 
    //             sub_width: { type: Number }, 
    //             sub_height: { type: Number }, 
    //             sub_total: { type: Number }, 
    //             sub_remark: { type: String },
    //         }]
    //     }]   
    // }]

    report_id:{ type: ObjectId },
    user_id:{ type: ObjectId },
    quantity_report_date:{ type:String, default:date },
    quantity_report_time:{ type:String, default:time }, 

});

export default mongoose.model('QuantityReport', quantityReportSchema, 'quantityReports');