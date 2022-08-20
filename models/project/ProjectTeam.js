import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const projectTeamSchema = mongoose.Schema({
    company_id:{ type:ObjectId, required:true},
    project_id:{ type:ObjectId, required:true},
    user_id: { type:ObjectId, required:true} 
}, { timestamps: true });

export default mongoose.model('ProjectTeam', projectTeamSchema, 'projectTeam');