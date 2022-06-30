import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const projectTeamSchema = mongoose.Schema({
    project_id:{ type:ObjectId},
    user_id:{ type:ObjectId },
});

export default mongoose.model('ProjectTeam', projectTeamSchema, 'projectTeam');