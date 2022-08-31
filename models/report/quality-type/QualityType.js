import mongoose from "mongoose";

const qualityTypeSchema = mongoose.Schema({
    type:{ type: String, required: true, unique: true },
    selected:{ type: Boolean, default:false },
});

export default mongoose.model('QualityType', qualityTypeSchema, 'qualityTypes');