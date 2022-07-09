import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const itemSchema = mongoose.Schema({
    unit_id: {type:ObjectId, required:true},
    item_name: {type:String, required:true, unique:true},
}, {timestamps: true});

export default mongoose.model('Item', itemSchema, 'items');