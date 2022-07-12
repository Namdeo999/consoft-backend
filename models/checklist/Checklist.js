import mongoose from "mongoose";

const checklistSchema = mongoose.Schema({
    checklist_name: {type: String, required:true}
})
 
export default mongoose.model('Checklist',checklistSchema, 'checklists');