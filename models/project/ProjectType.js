import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const projectTypeSchema = mongoose.Schema({
    company_id:{ type:ObjectId, required:true },
    category_id:{ type:String, required:true },
    project_type:{ type:String, required:true, unique:true },
});

export default mongoose.model('ProjectType', projectTypeSchema, 'projectTypes');