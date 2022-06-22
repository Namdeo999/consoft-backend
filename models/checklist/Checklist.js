import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const checklistSchema = mongoose.Schema({
    title: {type: String, required:true},
    check_items:{type:Array,required:true},
    checklist_option_type_id:{type:ObjectId}

})
 
export default mongoose.model('Checklist',checklistSchema, 'checklists');