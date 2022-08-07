import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import CustomFunction from "../../services/CustomFunction.js";

const date = CustomFunction.currentDate();
const time = CustomFunction.currentTime();

const attendanceSchema = mongoose.Schema({
    // user_id:{ type: ObjectId },
    // year: { type:String},
    // months:[{
    //     month: { type: Number },
    //     month_name: { type: String },
    //     presentdays:[{
    //         present_date:{type:String, default:date},
    //         in_time:{ type:String, default:time},
    //         out_time:{ type:String}
    //     }],
    //     leavedays:[{
    //         leave_date:{type:String},
    //         remark:{type:String},
    //         approved:{type:Boolean, default:false},
    //     }]
    // }]

    user_id:{ type: ObjectId },
    year: { type:String},
    month: { type: Number },
    month_name: { type: String },
    presentdates:[{
        present_date:{type:String, default:date},
        in_time:{ type:String, default:time},
        out_time:{ type:String}
    }],
    leavedates:[{
        leave_date:{type:String},
        remark:{type:String},
        approved:{type:Boolean, default:false},
    }] 
});

export default mongoose.model('Attendance', attendanceSchema, 'attendances');