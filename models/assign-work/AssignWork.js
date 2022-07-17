import mongoose from "mongoose";
import { ObjectId } from 'mongodb'

const assignWork = mongoose.Schema({
    company_id: { type: ObjectId, required:true },
    project_id: { type: ObjectId, required:true },
    role_id: { type: ObjectId, required:true },
    user_id: { type: ObjectId, required:true } 
},{ timestamps: true })

export default mongoose.model('AssignWork', assignWork, 'assignWorks') 