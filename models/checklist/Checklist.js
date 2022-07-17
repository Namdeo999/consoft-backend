import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const checklistSchema = mongoose.Schema({
    company_id: {type: ObjectId, required:true},
    checklist_option_type_id: {type: ObjectId, required:true},
    checklist_name: { type: String, required:true },
    items: [{
        checklist_item: { type:String, required:true } 
    }]
    
})
 
export default mongoose.model('Checklist',checklistSchema, 'checklists');