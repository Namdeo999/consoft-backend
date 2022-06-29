import mongoose from "mongoose";

const projectTypeSchema = mongoose.Schema({
    category_id:{ type:String, required:true },
    project_type:{ type:String, required:true, unique:true },
});

export default mongoose.model('ProjectType', projectTypeSchema, 'projectTypes');