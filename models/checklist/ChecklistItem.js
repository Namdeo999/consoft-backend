import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const checklistItemSchema = mongoose.Schema({
    checklist_id:{type:ObjectId},
    checklist_option_type_id:{type:ObjectId},
    checklist_item:{type:String, required:true},

})
 
export default mongoose.model('ChecklistItem',checklistItemSchema, 'checklistItems');