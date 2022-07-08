import mongoose from "mongoose";
import { ObjectId } from 'mongodb'

const contractor = mongoose.Schema({
    project_id: { type: ObjectId, required:true }, 
    contractor_name: { type: String, required:true },
    phone_no:{type:Number, required:true},

},{ timestamps: true })

export default mongoose.model('Contractor', contractor, 'contractors') 