import mongoose from "mongoose";

const checklistSchema = mongoose.Schema({
    title: {type: String, required:true},
    check_items:{type:Array,required:true}
})
 
export default mongoose.model('Checklist',checklistSchema, 'checklists');