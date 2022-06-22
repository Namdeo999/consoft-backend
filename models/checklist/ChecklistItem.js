import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const checklistItemSchema = mongoose.Schema({
    checklist_id:{type:String},
    checklist_option_type_id:{type:String},
    checklist_item:{type:String, required:true},

})
 
export default mongoose.model('ChecklistItem',checklistItemSchema, 'checklistItems');