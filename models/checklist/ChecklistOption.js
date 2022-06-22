import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const checklistOptionSchema = mongoose.Schema({
    option_type_id: {type:ObjectId, required:true},
    checklist_option: {type:String, required:true},
})

export default mongoose.model('ChecklistOption',checklistOptionSchema,'checklistOptions')
