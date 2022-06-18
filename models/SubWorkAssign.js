import mongoose from "mongoose";

// var Schema = mongoose.Schema,
//     ObjectId = Schema.ObjectId;

const SubWorkAssign = mongoose.Schema({
    assign_work_id: { type:String }, 
    list_id: { type: String },
    work: { type: Array }
})   

export default mongoose.model('SubWorkAssign', SubWorkAssign, 'subWorkAssigns')