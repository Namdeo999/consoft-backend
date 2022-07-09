import mongoose from "mongoose";
import { ObjectId } from 'mongodb'

const SubWorkAssign = mongoose.Schema({
    assign_work_id: { type:ObjectId },  
    user_id: { type: ObjectId },
    work_code: { type: Number}, 
    work: { type: String}, 
    exp_completion_date:{ type:String, required:true },
    exp_completion_time:{ type:String, required:true },
    comment:{ type:String, default: null },
    revert_comment:{ type:String, default: null },
    revert_status:{ type:Boolean, default:false },
    status:{ type:Boolean, default:false }
})   

export default mongoose.model('SubWorkAssign', SubWorkAssign, 'subWorkAssigns')