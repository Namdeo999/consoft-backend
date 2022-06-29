import mongoose from "mongoose";
import { ObjectId } from 'mongodb'

const assignWork = mongoose.Schema({
    role_id: { type: ObjectId },
    user_id: { type: ObjectId } 
},{ timestamps: true })

export default mongoose.model('AssignWork', assignWork, 'assignWorks') 