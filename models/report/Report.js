import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import CustomFunction from "../../services/CustomFunction.js";
const date = CustomFunction.currentDate();
const time = CustomFunction.currentTime();

const reportSchema = mongoose.Schema({
    company_id:{ type: ObjectId, required:true },
    project_id:{ type: ObjectId, required:true },
    user_id:{ type:ObjectId, required:true },
    report_date:{ type:String, default:date },
    report_time:{ type:String, default:time },
    verify_1_status:{ type:Boolean, default:false},
    verify_1_date:{ type:String, default:null},
    verify_1_time:{ type:String, default:null},
    verify_1_revert:{ type:Boolean, default:false},
    verify_1_revert_date:{ type:String, default:null},
    verify_1_revert_time:{ type:String, default:null},
    verify_1_revert_msg:{ type:String, default:null},
    admin_1_status:{ type:Boolean, default:false},
    admin_1_date:{ type:String, default:null},
    admin_1_time:{ type:String, default:null},
    admin_1_revert:{ type:Boolean, default:false},
    admin_1_revert_date:{ type:String, default:null},
    admin_1_revert_time:{ type:String, default:null},
    admin_1_revert_msg:{ type:String, default:null},
    admin_2_status:{ type:Boolean, default:false},
    admin_2_date:{ type:String, default:null},
    admin_2_time:{ type:String, default:null},
    admin_2_revert:{ type:Boolean, default:false},
    admin_2_revert_date:{ type:String, default:null},
    admin_2_revert_time:{ type:String, default:null},
    admin_2_revert_msg:{ type:String, default:null},
    report_status:{ type:Boolean, default:false }
}, { timestamps: true });



// const quantityReportSchema = mongoose.Schema({
//     report_id:{ type: ObjectId },
//     quantity_report_date:{ type:String, default:date },
//     quantity_report_time:{ type:String, default:time },
//     quantity: [{
//         particular: { type: String },
//         length: { type: Number }, 
//         width: { type: Number }, 
//         height: { type: Number }, 
//         qty: { type: Number }, 
//         item_id: { type: ObjectId }, 
//     }]

// });

// const Report = mongoose.model('Report', reportSchema, 'reports');
// const QuantityReport = mongoose.model('QuantityReport', quantityReportSchema, 'quantityReports');
// const Teacher = mongoose.model('teacher', teacherSchema);
  
// Exporting our model objects
// module.exports = {
//     Report, QuantityReport
// }



export default mongoose.model('Report', reportSchema, 'reports');