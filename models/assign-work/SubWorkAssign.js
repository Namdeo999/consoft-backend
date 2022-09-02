import mongoose from "mongoose";
import { ObjectId } from 'mongodb'
import CustomFunction from "../../services/CustomFunction.js";
const date = CustomFunction.currentDate();
const time = CustomFunction.currentTime();

const SubWorkAssign = mongoose.Schema({
    assign_work_id: { type:ObjectId },  
    company_id: { type:ObjectId },  
    project_id: { type:ObjectId },  
    user_id: { type: ObjectId },
    work_code: { type: Number}, 
    work: { type: String}, 
    exp_completion_date:{ type:String, required:true },
    exp_completion_time:{ type:String, required:true },
    work_percent:{ type: Number, default:0 },
    work_status:{ type: Boolean, default:false },
    submit_work_text:{ type: String, default:null },
    submit_work_date:{ type: String, default:null },
    submit_work_time:{ type: String, default:null },
    comment:{ type:String, default: null },
    comment_status:{ type:Boolean, default: false },
    revert_msg:{ type:String, default: null },
    revert_status:{ type:Boolean, default:false },
    verify_date: { type: String, default:null },
    verify_time: { type: String, default:null },
    verify: { type: Boolean, default:false },
    assign_date: { type:String, default:date },
    assign_time: { type:String, default:time },
    status:{ type:Boolean, default:false }
})   

export default mongoose.model('SubWorkAssign', SubWorkAssign, 'subWorkAssigns')