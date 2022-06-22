import mongoose from "mongoose";
import { ObjectId } from 'mongodb'
// var Schema = mongoose.Schema,
//     ObjectId = Schema.ObjectId;

const SubWorkAssign = mongoose.Schema({
    assign_work_id: { type:ObjectId },  
    user_id: { type: ObjectId },
    work: { type: Array }, 
    status:{type:Boolean}
})   

export default mongoose.model('SubWorkAssign', SubWorkAssign, 'subWorkAssigns')