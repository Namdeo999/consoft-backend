import mongoose from "mongoose";

const projectSchema = mongoose.Schema({
    project_name: {type: String, required: true},
    project_location:{type:String, required:true},
    plot_area:{type:Number, required:true},
    project_type:{type:String, required:true},
},{ timestamps: true });

export default mongoose.model('Project', projectSchema);