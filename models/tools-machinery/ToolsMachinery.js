import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const toolsMachinerySchema = mongoose.Schema({
    company_id: {type: ObjectId, required:true},
    tools_machinery_name: {type: String, required:true},
    qty: {type: Number, required:true},
})

export default mongoose.model('ToolsMachinery', toolsMachinerySchema, 'toolsMachineries');