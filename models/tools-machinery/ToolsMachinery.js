import mongoose from "mongoose";

const toolsMachinerySchema = mongoose.Schema({
    tools_machinery_name: {type: String, required:true},
})

export default mongoose.model('ToolsMachinery', toolsMachinerySchema, 'toolsMachinery');