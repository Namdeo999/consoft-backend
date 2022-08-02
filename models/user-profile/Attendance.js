import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const attendanceSchema = mongoose.Schema({
    user_id:{ type: ObjectId },
    year: { type:String},
    months:[{
        month: { type: String },
        presentdays:[{
            present_date:{type:String},
            in_time:{ type:String},
            out_time:{ type:String}
        }],
        leavedays:[{
            leave_date:{type:String},
            remark:{type:String},
            approved:{type:Boolean, default:false},
        }]
    }]
   
});

export default mongoose.model('Attendance', attendanceSchema, 'attendances');