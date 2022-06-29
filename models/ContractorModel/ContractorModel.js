import mongoose from "mongoose";
import { ObjectId } from 'mongodb'

const contractor = mongoose.Schema({
    contractor_name: { type: String },
    phone_no:{type:Number},
    date: { type: Date } 

},{ timestamps: true })

export default mongoose.model('Contractor', contractor, 'contractors') 