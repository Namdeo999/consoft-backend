import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const projectSchema = mongoose.Schema({
    company_id: {type: ObjectId, required: true},
    project_name: {type: String, required: true},
    project_location:{type:String, required:true},
    project_category:{type:String, required:true},
    project_type:{type:String, required:true},
    project_area:{type:Number, required:true},
    project_measurement:{type:String, required:true},
},{ timestamps: true });

export default mongoose.model('Project', projectSchema);