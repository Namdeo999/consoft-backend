import { ObjectId } from "mongodb";
import mongoose from "mongoose";
// import CustomFunction from "../../services/CustomFunction.js";
// const date = CustomFunction.currentDate();
// const time = CustomFunction.currentTime();

const reportSchema = mongoose.Schema({
    company_id:{ type: ObjectId, required:true },
    project_id:{ type: ObjectId, required:true },
    // user_id:{ type:ObjectId, required:true },
});



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