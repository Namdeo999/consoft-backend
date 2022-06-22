import mongoose from "mongoose";

const checklistOptionTypeSchema = mongoose.Schema({
    option_type: {type:String, required:true}
})

export default mongoose.model('ChecklistOptionType',checklistOptionTypeSchema,'checklistOptionTypes')