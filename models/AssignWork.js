import mongoose from "mongoose";


const assignWork = mongoose.Schema({
    role_id: { type: String, required: true },
    list: { type: Array, required: true },
    
})

export default mongoose.model('AssignWork', assignWork, 'assignWorks')