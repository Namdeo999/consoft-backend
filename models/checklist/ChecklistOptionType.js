import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const checklistOptionTypeSchema = mongoose.Schema({
    company_id: {type:ObjectId, required:true},
    option_type: {type:String, required:true}
})

export default mongoose.model('ChecklistOptionType',checklistOptionTypeSchema,'checklistOptionTypes')