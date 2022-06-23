import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const checklistSchema = mongoose.Schema({
    checklist_name: {type: String, required:true},
    // checklist_item:{type:Array,required:true},
    // checklist_option_type_id:{type:ObjectId}

})
 
export default mongoose.model('Checklist',checklistSchema, 'checklists');