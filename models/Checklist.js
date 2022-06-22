import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const checklistSchema = mongoose.Schema({
    title: {type: String, required:true},
    check_items:{type:Array,required:true},
    checklist_option_type_id:{type:String}
})
 
export default mongoose.model('Checklist',checklistSchema, 'checklists');