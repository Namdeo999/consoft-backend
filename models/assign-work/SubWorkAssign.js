import mongoose from "mongoose";
import { ObjectId } from 'mongodb'

const SubWorkAssign = mongoose.Schema({
    assign_work_id: { type:ObjectId },  
    company_id: { type:ObjectId },  
    project_id: { type:ObjectId },  
    user_id: { type: ObjectId },
    work_code: { type: Number}, 
    work: { type: String}, 
    exp_completion_date:{ type:String, required:true },
    exp_completion_time:{ type:String, required:true },
    comment:{ type:String, default: null },
    revert_msg:{ type:String, default: null },
    revert_status:{ type:Boolean, default:false },
    submit_work_text:{ type: String, default:null },
    submit_work_date:{ type: String, default:null },
    submit_work_time:{ type: String, default:null },
    work_status:{ type: Boolean, default:false },
    verify_date: { type: String, default:null },
    verify_time: { type: String, default:null },
    verify: { type: Boolean, default:false },
    status:{ type:Boolean, default:false }
})   

export default mongoose.model('SubWorkAssign', SubWorkAssign, 'subWorkAssigns')