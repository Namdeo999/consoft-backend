import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const projectTeamSchema = mongoose.Schema({
    project_id:{ type:ObjectId},
    users: [{
        user_id: { type:ObjectId } 
    }]
    // users: { type : Array}

    

});

export default mongoose.model('ProjectTeam', projectTeamSchema, 'projectTeam');