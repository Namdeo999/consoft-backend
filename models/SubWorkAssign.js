import mongoose from "mongoose";
import { ObjectId } from 'mongodb'

const SubWorkAssign = mongoose.Schema({
    assign_work_id: { type:ObjectId },  
    user_id: { type: ObjectId },
    work_code: { type: Number}, 
    work: { type: String}, 
    comment:{ type:String },
    exp_completion_time:{ type:String },
    revert_comment:{ type:String },
    revert_status:{ type:Boolean },
    status:{ type:Boolean }
})   

export default mongoose.model('SubWorkAssign', SubWorkAssign, 'subWorkAssigns')